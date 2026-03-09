export interface Question {
  id: string;
  source: 'seed' | 'qbreader' | 'opentdb';
  source_id?: string;
  category: string;
  subcategory?: string;
  difficulty: number;
  question_text: string;
  answer: string;
  answer_aliases: string[];
  metadata?: Record<string, unknown>;
  created_at: string;
}
