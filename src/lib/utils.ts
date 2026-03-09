export function generateRoomCode(length = 6): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/^(the|a|an)\s+/i, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

export function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export function fuzzyMatch(
  userAnswer: string,
  correctAnswer: string,
  aliases: string[] = []
): boolean {
  const normalizedUser = normalize(userAnswer);
  const allAnswers = [correctAnswer, ...aliases].map(normalize);

  for (const ans of allAnswers) {
    if (normalizedUser === ans) return true;
    const threshold = ans.length <= 15 ? 2 : 3;
    if (levenshtein(normalizedUser, ans) <= threshold) return true;
    // Check last word match (for names like "William Shakespeare" -> "Shakespeare")
    const lastWord = ans.split(' ').pop() || '';
    if (lastWord.length > 3 && normalizedUser === lastWord) return true;
  }
  return false;
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
