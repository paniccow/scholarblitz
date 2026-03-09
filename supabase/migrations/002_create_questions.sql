-- Create questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL DEFAULT 'seed',
  source_id TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  difficulty INTEGER DEFAULT 3 CHECK (difficulty BETWEEN 1 AND 5),
  question_text TEXT NOT NULL,
  answer TEXT NOT NULL,
  answer_aliases TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_source ON questions(source);
CREATE INDEX idx_questions_source_id ON questions(source, source_id);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
