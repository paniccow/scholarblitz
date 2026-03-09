/**
 * QB Reader API integration for fetching quiz bowl tossup questions.
 * Can be used at runtime or in the seeding script.
 */

export interface QBReaderTossup {
  question: string;
  answer: string;
  category: string;
  subcategory: string;
  packet?: string;
  set?: string;
  difficulty?: number;
}

interface QBReaderResponse {
  tossups: QBReaderTossup[];
}

/** Map QB Reader categories to our internal category names */
const CATEGORY_MAP: Record<string, string> = {
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
  'Current Events': 'General',
};

/** Strip HTML tags from QB Reader answer strings (e.g. <b>answer</b>) */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

/** Extract the primary answer and aliases from QB Reader's formatted answer string */
function parseAnswer(rawAnswer: string): { answer: string; aliases: string[] } {
  const cleaned = stripHtml(rawAnswer);
  // QB Reader answers often have format: "main answer [accept: alt1 or alt2]"
  const bracketMatch = cleaned.match(/^(.+?)\s*\[(?:accept|or|prompt|accept either)[:\s]*(.+?)\]$/i);
  if (bracketMatch) {
    const main = bracketMatch[1].trim();
    const alts = bracketMatch[2]
      .split(/\s+or\s+|;\s*|,\s*/i)
      .map((s) => s.trim())
      .filter(Boolean);
    return { answer: main, aliases: alts };
  }

  // Handle parenthetical alternatives: "answer (or other answer)"
  const parenMatch = cleaned.match(/^(.+?)\s*\((?:or |also )?(.+?)\)$/i);
  if (parenMatch) {
    return { answer: parenMatch[1].trim(), aliases: [parenMatch[2].trim()] };
  }

  return { answer: cleaned, aliases: [] };
}

/**
 * Fetch tossup questions from QB Reader API.
 * @param category - QB Reader category name (e.g. 'Literature', 'Science')
 * @param count - Number of questions to fetch (max 100 per request)
 */
export async function fetchQBReaderQuestions(
  category: string,
  count: number = 100
): Promise<
  Array<{
    source: 'qbreader';
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
  const url = `https://www.qbreader.org/api/random-tossup?number=${Math.min(count, 100)}&categories=${encodeURIComponent(category)}`;

  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`QB Reader API error: ${resp.status} ${resp.statusText}`);
  }

  const data: QBReaderResponse = await resp.json();
  const mappedCategory = CATEGORY_MAP[category] ?? 'General';

  return data.tossups.map((t, i) => {
    const { answer, aliases } = parseAnswer(t.answer);
    return {
      source: 'qbreader' as const,
      source_id: `qb-${category.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${i}`,
      category: mappedCategory,
      subcategory: t.subcategory || '',
      difficulty: t.difficulty ?? 3,
      question_text: stripHtml(t.question),
      answer,
      answer_aliases: aliases,
      metadata: {
        original_category: t.category,
        packet: t.packet,
        set: t.set,
      },
    };
  });
}
