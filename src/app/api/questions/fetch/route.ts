import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Map QB Reader categories to our categories
const QB_CATEGORY_MAP: Record<string, string> = {
  'Science': 'Science',
  'History': 'History',
  'Literature': 'Literature',
  'Fine Arts': 'Fine Arts',
  'Geography': 'Geography',
  'Mathematics': 'Math',
  'Religion': 'Religion',
  'Philosophy': 'Philosophy',
  'Social Science': 'Social Science',
  'Mythology': 'Mythology',
  'Trash': 'Pop Culture',
  'Current Events': 'General',
};

// Map Open Trivia DB categories to our categories
const OTDB_CATEGORY_MAP: Record<number, string> = {
  9: 'General',       // General Knowledge
  17: 'Science',      // Science & Nature
  18: 'Science',      // Science: Computers
  19: 'Math',         // Science: Mathematics
  23: 'History',      // History
  22: 'Geography',    // Geography
  10: 'Literature',   // Entertainment: Books
  25: 'Fine Arts',    // Entertainment: Art
  20: 'Mythology',    // Mythology
  21: 'Sports',       // Sports
  24: 'Pop Culture',  // Entertainment: Television
  11: 'Pop Culture',  // Entertainment: Film
  12: 'Pop Culture',  // Entertainment: Music
};

function decodeHtml(html: string): string {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"');
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = createAdminClient();
    let insertedCount = 0;

    // Fetch from QB Reader API
    try {
      const qbRes = await fetch('https://www.qbreader.org/api/random-tossup?number=50', {
        headers: { 'Content-Type': 'application/json' },
      });

      if (qbRes.ok) {
        const qbData = await qbRes.json();
        const tossups = qbData.tossups || [];

        const qbQuestions = tossups
          .filter((t: { category?: string }) => t.category && QB_CATEGORY_MAP[t.category])
          .map((t: {
            _id?: string;
            category: string;
            subcategory?: string;
            question: string;
            answer: string;
            difficulty?: number;
          }) => ({
            source: 'qbreader' as const,
            source_id: t._id || `qb_${Date.now()}_${Math.random().toString(36).slice(2)}`,
            category: QB_CATEGORY_MAP[t.category] || 'General',
            subcategory: t.subcategory || null,
            question_text: t.question,
            answer: t.answer.replace(/<[^>]*>/g, '').trim(), // Strip HTML tags
            answer_aliases: [],
            difficulty: t.difficulty || 3,
            metadata: { original_category: t.category },
          }));

        if (qbQuestions.length > 0) {
          const { data, error } = await admin
            .from('questions')
            .upsert(qbQuestions, { onConflict: 'source,source_id', ignoreDuplicates: true })
            .select('id');

          if (!error && data) {
            insertedCount += data.length;
          }
        }
      }
    } catch (err) {
      console.error('QB Reader fetch error:', err);
    }

    // Fetch from Open Trivia DB
    try {
      const otdbRes = await fetch('https://opentdb.com/api.php?amount=50&type=multiple');

      if (otdbRes.ok) {
        const otdbData = await otdbRes.json();
        const results = otdbData.results || [];

        const otdbQuestions = results
          .filter((q: { category_id?: number; category?: string }) => {
            // Try to map by known category IDs or names
            return true; // Accept all and map what we can
          })
          .map((q: {
            category: string;
            question: string;
            correct_answer: string;
            incorrect_answers: string[];
            difficulty: string;
          }, index: number) => {
            // Find matching category
            let mappedCategory = 'General';
            for (const [id, cat] of Object.entries(OTDB_CATEGORY_MAP)) {
              // Match by category name substring
              const catNames: Record<number, string> = {
                9: 'General Knowledge', 17: 'Science & Nature', 18: 'Computers',
                19: 'Mathematics', 23: 'History', 22: 'Geography', 10: 'Books',
                25: 'Art', 20: 'Mythology', 21: 'Sports', 24: 'Television',
                11: 'Film', 12: 'Music',
              };
              if (q.category.includes(catNames[Number(id)] || '')) {
                mappedCategory = cat;
                break;
              }
            }

            const difficultyMap: Record<string, number> = {
              easy: 1,
              medium: 3,
              hard: 5,
            };

            return {
              source: 'opentdb' as const,
              source_id: `otdb_${Date.now()}_${index}`,
              category: mappedCategory,
              subcategory: q.category,
              question_text: decodeHtml(q.question),
              answer: decodeHtml(q.correct_answer),
              answer_aliases: [],
              difficulty: difficultyMap[q.difficulty] || 3,
              metadata: { original_category: q.category, difficulty: q.difficulty },
            };
          });

        if (otdbQuestions.length > 0) {
          const { data, error } = await admin
            .from('questions')
            .upsert(otdbQuestions, { onConflict: 'source,source_id', ignoreDuplicates: true })
            .select('id');

          if (!error && data) {
            insertedCount += data.length;
          }
        }
      }
    } catch (err) {
      console.error('Open Trivia DB fetch error:', err);
    }

    return NextResponse.json({ insertedCount });
  } catch (error) {
    console.error('Questions fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
