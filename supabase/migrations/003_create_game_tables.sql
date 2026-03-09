-- Game sessions
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES profiles(id),
  mode TEXT NOT NULL CHECK (mode IN ('solo', 'multiplayer')),
  status TEXT NOT NULL DEFAULT 'lobby' CHECK (status IN ('lobby', 'active', 'finished')),
  categories TEXT[] NOT NULL,
  question_count INTEGER NOT NULL DEFAULT 20,
  time_per_question INTEGER NOT NULL DEFAULT 15,
  tts_enabled BOOLEAN NOT NULL DEFAULT true,
  current_question_index INTEGER NOT NULL DEFAULT 0,
  room_code TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ
);

CREATE INDEX idx_sessions_room_code ON game_sessions(room_code);
CREATE INDEX idx_sessions_host ON game_sessions(host_id);
CREATE INDEX idx_sessions_status ON game_sessions(status);

-- Game players (join table)
CREATE TABLE game_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  score INTEGER NOT NULL DEFAULT 0,
  is_host BOOLEAN NOT NULL DEFAULT false,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(session_id, user_id)
);

CREATE INDEX idx_game_players_session ON game_players(session_id);
CREATE INDEX idx_game_players_user ON game_players(user_id);

-- Ordered questions for a game
CREATE TABLE game_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id),
  question_index INTEGER NOT NULL,
  UNIQUE(session_id, question_index)
);

CREATE INDEX idx_game_questions_session ON game_questions(session_id);

-- Answer attempts
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  question_id UUID NOT NULL REFERENCES questions(id),
  answer_text TEXT,
  is_correct BOOLEAN NOT NULL,
  time_taken_ms INTEGER,
  points_awarded INTEGER NOT NULL DEFAULT 0,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_answers_user ON answers(user_id);
CREATE INDEX idx_answers_session ON answers(session_id);
