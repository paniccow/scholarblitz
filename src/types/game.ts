export interface GameSession {
  id: string;
  host_id: string;
  mode: 'solo' | 'multiplayer';
  status: 'lobby' | 'active' | 'finished';
  categories: string[];
  question_count: number;
  time_per_question: number;
  tts_enabled: boolean;
  current_question_index: number;
  room_code?: string;
  created_at: string;
  finished_at?: string;
}

export interface GamePlayer {
  id: string;
  session_id: string;
  user_id: string;
  score: number;
  is_host: boolean;
  joined_at: string;
  display_name?: string;
}

export interface Profile {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  plan: 'free' | 'paid';
  free_seconds_used: number;
  stripe_customer_id?: string;
  stripe_payment_id?: string;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

export type GameState = 'idle' | 'reading' | 'buzzed' | 'answered' | 'revealed' | 'finished';

export interface PlayerScore {
  userId: string;
  displayName: string;
  score: number;
}
