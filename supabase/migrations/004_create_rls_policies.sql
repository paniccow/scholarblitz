-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Profiles: users can update their own display_name, avatar_url, onboarding_complete
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Questions: all authenticated users can read
CREATE POLICY "Authenticated users can read questions"
  ON questions FOR SELECT
  TO authenticated
  USING (true);

-- Game sessions: players in the game can read
CREATE POLICY "Players can read their game sessions"
  ON game_sessions FOR SELECT
  TO authenticated
  USING (
    id IN (SELECT session_id FROM game_players WHERE user_id = auth.uid())
    OR host_id = auth.uid()
  );

-- Game sessions: host can update
CREATE POLICY "Host can update game session"
  ON game_sessions FOR UPDATE
  TO authenticated
  USING (host_id = auth.uid());

-- Game sessions: authenticated users can create
CREATE POLICY "Authenticated users can create game sessions"
  ON game_sessions FOR INSERT
  TO authenticated
  WITH CHECK (host_id = auth.uid());

-- Game players: players in the game can read
CREATE POLICY "Players can read game players"
  ON game_players FOR SELECT
  TO authenticated
  USING (
    session_id IN (SELECT session_id FROM game_players gp WHERE gp.user_id = auth.uid())
  );

-- Game players: authenticated users can join games
CREATE POLICY "Authenticated users can join games"
  ON game_players FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Game players: users can update their own score
CREATE POLICY "Players can update own score"
  ON game_players FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Game questions: players can read their game's questions
CREATE POLICY "Players can read game questions"
  ON game_questions FOR SELECT
  TO authenticated
  USING (
    session_id IN (SELECT session_id FROM game_players WHERE user_id = auth.uid())
  );

-- Game questions: host can insert
CREATE POLICY "Host can create game questions"
  ON game_questions FOR INSERT
  TO authenticated
  WITH CHECK (
    session_id IN (SELECT id FROM game_sessions WHERE host_id = auth.uid())
  );

-- Answers: users can read their own answers
CREATE POLICY "Users can read own answers"
  ON answers FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Answers: users can insert their own answers
CREATE POLICY "Users can insert own answers"
  ON answers FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());
