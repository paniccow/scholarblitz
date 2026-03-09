/**
 * Open Trivia Database API integration for fetching trivia questions.
 * Can be used at runtime or in the seeding script.
 */

interface OpenTDBResult {
  type: string;
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface OpenTDBResponse {
  response_code: number;
  results: OpenTDBResult[];
}

/** Map Open TDB category IDs to our internal category names */
export const OPENTDB_CATEGORY_MAP: Record<number, string> = {
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
  31: 'Pop Culture',
  32: 'Pop Culture',
};

/** Decode HTML entities commonly found in OpenTDB responses */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&eacute;/g, 'e')
    .replace(/&ouml;/g, 'o')
    .replace(/&uuml;/g, 'u')
    .replace(/&auml;/g, 'a')
    .replace(/&szlig;/g, 'ss')
    .replace(/&ntilde;/g, 'n')
    .replace(/&shy;/g, '')
    .replace(/&lrm;/g, '')
    .replace(/&rlm;/g, '')
    .replace(/&ldquo;/g, '\u201c')
    .replace(/&rdquo;/g, '\u201d')
    .replace(/&lsquo;/g, '\u2018')
    .replace(/&rsquo;/g, '\u2019')
    .replace(/&mdash;/g, '\u2014')
    .replace(/&ndash;/g, '\u2013')
    .replace(/&hellip;/g, '\u2026')
    .replace(/&pi;/g, '\u03c0')
    .replace(/&deg;/g, '\u00b0')
    .replace(/&#\d+;/g, (match) => {
      const code = parseInt(match.slice(2, -1));
      return String.fromCharCode(code);
    });
}

/** Map OpenTDB difficulty to numeric 1-5 scale */
function mapDifficulty(difficulty: string): number {
  switch (difficulty) {
    case 'easy':
      return 1;
    case 'medium':
      return 3;
    case 'hard':
      return 5;
    default:
      return 3;
  }
}

/**
 * Fetch questions from the Open Trivia Database.
 * @param categoryId - OpenTDB category ID (see OPENTDB_CATEGORY_MAP)
 * @param count - Number of questions to fetch (max 50 per request)
 */
export async function fetchOpenTDBQuestions(
  categoryId: number,
  count: number = 50
): Promise<
  Array<{
    source: 'opentdb';
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
  const url = `https://opentdb.com/api.php?amount=${Math.min(count, 50)}&category=${categoryId}&type=multiple`;

  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`OpenTDB API error: ${resp.status} ${resp.statusText}`);
  }

  const data: OpenTDBResponse = await resp.json();
  if (data.response_code !== 0) {
    const codes: Record<number, string> = {
      1: 'Not enough questions for this category',
      2: 'Invalid category parameter',
      3: 'Token not found',
      4: 'All questions exhausted for token',
      5: 'Rate limited',
    };
    throw new Error(`OpenTDB response code ${data.response_code}: ${codes[data.response_code] ?? 'Unknown error'}`);
  }

  const mappedCategory = OPENTDB_CATEGORY_MAP[categoryId] ?? 'General';

  return data.results.map((r, i) => {
    const questionText = decodeHtmlEntities(r.question);
    const correctAnswer = decodeHtmlEntities(r.correct_answer);

    return {
      source: 'opentdb' as const,
      source_id: `otdb-${categoryId}-${Date.now()}-${i}`,
      category: mappedCategory,
      subcategory: decodeHtmlEntities(r.category),
      difficulty: mapDifficulty(r.difficulty),
      question_text: questionText,
      answer: correctAnswer,
      answer_aliases: [],
      metadata: {
        original_category: r.category,
        original_difficulty: r.difficulty,
        incorrect_answers: r.incorrect_answers.map(decodeHtmlEntities),
      },
    };
  });
}
