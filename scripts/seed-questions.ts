import { createClient } from '@supabase/supabase-js';
import { seedQuestions } from '../src/lib/questions/seed-data';

// Load env from .env.local
import { config } from 'dotenv';
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || supabaseUrl === 'your_supabase_url') {
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ---- QB Reader API ----
const QB_CATEGORIES = [
  'Literature',
  'History',
  'Science',
  'Fine Arts',
  'Religion',
  'Mythology',
  'Philosophy',
  'Social Science',
  'Geography',
  'Trash',
];

const QB_TO_OUR_CATEGORY: Record<string, string> = {
  Literature: 'Literature',
  History: 'History',
  Science: 'Science',
  'Fine Arts': 'Fine Arts',
  Religion: 'Religion',
  Mythology: 'Mythology',
  Philosophy: 'Philosophy',
  'Social Science': 'Social Science',
  Geography: 'Geography',
  Trash: 'Pop Culture',
};

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&ntilde;/g, 'ñ')
    .replace(/&eacute;/g, 'é')
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .trim();
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&eacute;/g, 'é')
    .replace(/&ntilde;/g, 'ñ')
    .replace(/&ouml;/g, 'ö')
    .replace(/&uuml;/g, 'ü')
    .replace(/&aacute;/g, 'á')
    .replace(/&iacute;/g, 'í')
    .replace(/&oacute;/g, 'ó')
    .replace(/&uacute;/g, 'ú')
    .replace(/&Eacute;/g, 'É')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…')
    .replace(/&trade;/g, '™')
    .replace(/&copy;/g, '©')
    .replace(/&reg;/g, '®')
    .replace(/&shy;/g, '')
    .replace(/&deg;/g, '°')
    .replace(/&pi;/g, 'π')
    .replace(/&#\d+;/g, (match) => {
      const code = parseInt(match.replace('&#', '').replace(';', ''));
      return String.fromCharCode(code);
    });
}

async function fetchQBReaderQuestions(): Promise<
  Array<{
    source: string;
    source_id: string;
    category: string;
    subcategory: string;
    difficulty: number;
    question_text: string;
    answer: string;
    answer_aliases: string[];
    metadata: Record<string, unknown>;
  }>
> {
  const questions: Array<{
    source: string;
    source_id: string;
    category: string;
    subcategory: string;
    difficulty: number;
    question_text: string;
    answer: string;
    answer_aliases: string[];
    metadata: Record<string, unknown>;
  }> = [];

  for (const cat of QB_CATEGORIES) {
    // Fetch multiple batches per category
    for (let batch = 0; batch < 5; batch++) {
      try {
        console.log(`  Fetching QB Reader: ${cat} (batch ${batch + 1}/5)...`);
        const url = `https://www.qbreader.org/api/random-tossup?number=50&categories=${encodeURIComponent(cat)}`;
        const res = await fetch(url);
        if (!res.ok) {
          console.warn(`  Warning: QB Reader returned ${res.status} for ${cat}`);
          break;
        }
        const data = await res.json();
        const tossups = data.tossups || [];

        for (const t of tossups) {
          const answer = stripHtml(t.answer || '');
          const questionText = stripHtml(t.question || '');
          if (!answer || !questionText) continue;

          // Extract primary answer (before parenthetical/bracket)
          const primaryAnswer = answer
            .replace(/\[.*?\]/g, '')
            .replace(/\(.*?\)/g, '')
            .split(';')[0]
            .trim();

          // Extract aliases from brackets/parens
          const aliases: string[] = [];
          const bracketMatch = answer.match(/\[(.*?)\]/g);
          const parenMatch = answer.match(/\((.*?)\)/g);
          if (bracketMatch) {
            bracketMatch.forEach((m) =>
              aliases.push(m.replace(/[\[\]]/g, '').trim())
            );
          }
          if (parenMatch) {
            parenMatch.forEach((m) =>
              aliases.push(m.replace(/[()]/g, '').trim())
            );
          }
          // Also add "accept" variants
          const acceptMatch = answer.match(
            /accept\s+(.+?)(?:\s+before|\s+until|\s*$)/i
          );
          if (acceptMatch) aliases.push(acceptMatch[1].trim());

          questions.push({
            source: 'qbreader',
            source_id: t._id || `qb_${Date.now()}_${Math.random()}`,
            category: QB_TO_OUR_CATEGORY[cat] || 'General',
            subcategory: t.subcategory || '',
            difficulty: t.difficulty
              ? Math.min(5, Math.max(1, t.difficulty))
              : 3,
            question_text: questionText,
            answer: primaryAnswer,
            answer_aliases: aliases.filter(
              (a) => a.length > 0 && a !== primaryAnswer
            ),
            metadata: {
              packet: t.packet,
              set: t.set,
              year: t.year,
              original_answer: answer,
            },
          });
        }

        // Rate limit
        await new Promise((r) => setTimeout(r, 500));
      } catch (err) {
        console.warn(`  Error fetching QB Reader ${cat} batch ${batch}:`, err);
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }

  return questions;
}

// ---- Open Trivia Database ----
const OPENTDB_CATEGORIES: Record<number, string> = {
  9: 'General',
  10: 'Literature',
  11: 'Pop Culture',
  12: 'Pop Culture',
  14: 'Pop Culture',
  15: 'Pop Culture',
  17: 'Science',
  18: 'Science',
  19: 'Math',
  20: 'Mythology',
  21: 'Sports',
  22: 'Geography',
  23: 'History',
  24: 'Pop Culture',
  25: 'Fine Arts',
  26: 'Pop Culture',
  27: 'General',
  28: 'Pop Culture',
  29: 'Pop Culture',
  30: 'Pop Culture',
  31: 'Pop Culture',
  32: 'Pop Culture',
};

async function fetchOpenTDBQuestions(): Promise<
  Array<{
    source: string;
    source_id: string;
    category: string;
    subcategory: string;
    difficulty: number;
    question_text: string;
    answer: string;
    answer_aliases: string[];
    metadata: Record<string, unknown>;
  }>
> {
  const questions: Array<{
    source: string;
    source_id: string;
    category: string;
    subcategory: string;
    difficulty: number;
    question_text: string;
    answer: string;
    answer_aliases: string[];
    metadata: Record<string, unknown>;
  }> = [];

  const difficultyMap: Record<string, number> = {
    easy: 1,
    medium: 3,
    hard: 5,
  };

  for (const [catId, ourCategory] of Object.entries(OPENTDB_CATEGORIES)) {
    try {
      console.log(`  Fetching OpenTDB: category ${catId} (${ourCategory})...`);
      const url = `https://opentdb.com/api.php?amount=50&category=${catId}&type=multiple`;
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`  Warning: OpenTDB returned ${res.status} for category ${catId}`);
        continue;
      }
      const data = await res.json();
      if (data.response_code !== 0) {
        console.warn(`  Warning: OpenTDB response_code ${data.response_code} for category ${catId}`);
        continue;
      }

      for (const q of data.results || []) {
        const questionText = decodeHtmlEntities(q.question);
        const answer = decodeHtmlEntities(q.correct_answer);

        questions.push({
          source: 'opentdb',
          source_id: `otdb_${catId}_${Buffer.from(questionText).toString('base64').slice(0, 20)}`,
          category: ourCategory,
          subcategory: decodeHtmlEntities(q.category),
          difficulty: difficultyMap[q.difficulty] || 3,
          question_text: questionText,
          answer: answer,
          answer_aliases: [],
          metadata: {
            incorrect_answers: q.incorrect_answers?.map(decodeHtmlEntities),
            original_category: q.category,
          },
        });
      }

      // OpenTDB rate limit: 1 request per 5 seconds
      await new Promise((r) => setTimeout(r, 5500));
    } catch (err) {
      console.warn(`  Error fetching OpenTDB category ${catId}:`, err);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }

  return questions;
}

async function insertQuestions(
  questions: Array<{
    source: string;
    source_id?: string;
    category: string;
    subcategory?: string;
    difficulty: number;
    question_text: string;
    answer: string;
    answer_aliases: string[];
    metadata?: Record<string, unknown>;
  }>
): Promise<number> {
  let inserted = 0;
  const batchSize = 100;

  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    const { error, count } = await supabase
      .from('questions')
      .upsert(
        batch.map((q) => ({
          source: q.source,
          source_id: q.source_id,
          category: q.category,
          subcategory: q.subcategory || null,
          difficulty: q.difficulty,
          question_text: q.question_text,
          answer: q.answer,
          answer_aliases: q.answer_aliases,
          metadata: q.metadata || {},
        })),
        { onConflict: 'source,source_id', ignoreDuplicates: true }
      );

    if (error) {
      console.warn(`  Batch insert error (batch ${Math.floor(i / batchSize) + 1}):`, error.message);
      // Try individual inserts for this batch
      for (const q of batch) {
        const { error: singleError } = await supabase.from('questions').insert({
          source: q.source,
          source_id: q.source_id,
          category: q.category,
          subcategory: q.subcategory || null,
          difficulty: q.difficulty,
          question_text: q.question_text,
          answer: q.answer,
          answer_aliases: q.answer_aliases,
          metadata: q.metadata || {},
        });
        if (!singleError) inserted++;
      }
    } else {
      inserted += batch.length;
    }
    process.stdout.write(`\r  Inserted ${inserted}/${questions.length} questions`);
  }
  console.log('');
  return inserted;
}

async function main() {
  console.log('🚀 ScholarBlitz Question Seeder');
  console.log('================================\n');

  // Step 1: Insert seed questions
  console.log('📚 Step 1: Inserting seed questions...');
  const seedData = seedQuestions.map((q, i) => ({
    source: 'seed' as const,
    source_id: `seed_${i}`,
    category: q.category,
    subcategory: undefined,
    difficulty: q.difficulty,
    question_text: q.question_text,
    answer: q.answer,
    answer_aliases: q.answer_aliases,
    metadata: {},
  }));
  const seedCount = await insertQuestions(seedData);
  console.log(`  ✅ Inserted ${seedCount} seed questions\n`);

  // Step 2: Fetch from QB Reader
  console.log('📖 Step 2: Fetching from QB Reader API...');
  const qbQuestions = await fetchQBReaderQuestions();
  console.log(`  Fetched ${qbQuestions.length} questions from QB Reader`);
  const qbCount = await insertQuestions(qbQuestions);
  console.log(`  ✅ Inserted ${qbCount} QB Reader questions\n`);

  // Step 3: Fetch from Open Trivia Database
  console.log('🎯 Step 3: Fetching from Open Trivia Database...');
  const otdbQuestions = await fetchOpenTDBQuestions();
  console.log(`  Fetched ${otdbQuestions.length} questions from OpenTDB`);
  const otdbCount = await insertQuestions(otdbQuestions);
  console.log(`  ✅ Inserted ${otdbCount} OpenTDB questions\n`);

  // Summary
  const total = seedCount + qbCount + otdbCount;
  console.log('================================');
  console.log(`🎉 Total questions seeded: ${total}`);
  console.log(`   - Seed data: ${seedCount}`);
  console.log(`   - QB Reader: ${qbCount}`);
  console.log(`   - Open Trivia DB: ${otdbCount}`);
  console.log('================================\n');

  // Check total in database
  const { count } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true });
  console.log(`📊 Total questions in database: ${count}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
