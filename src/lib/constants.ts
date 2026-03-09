export const FREE_TIME_LIMIT = 900; // 15 minutes in seconds
export const PRICE_AMOUNT = 20; // $20 one-time payment
export const USAGE_TRACK_INTERVAL = 10; // seconds between usage updates
export const ROOM_CODE_LENGTH = 6;
export const DEFAULT_QUESTION_COUNT = 20;
export const DEFAULT_TIME_PER_QUESTION = 15; // seconds

export const CATEGORIES = [
  'General',
  'Science',
  'History',
  'Literature',
  'Fine Arts',
  'Geography',
  'Math',
  'Pop Culture',
  'Sports',
  'Religion',
  'Philosophy',
  'Social Science',
  'Mythology',
] as const;

export type Category = (typeof CATEGORIES)[number];
