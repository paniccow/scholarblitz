import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = createAdminClient();

    // Get all answers for this user joined with question category
    const { data: answers, error } = await admin
      .from('answers')
      .select('is_correct, points_awarded, questions(category)')
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }

    const total = answers?.length ?? 0;
    const correct = answers?.filter((a) => a.is_correct).length ?? 0;
    const totalPoints = answers?.reduce((sum, a) => sum + (a.points_awarded ?? 0), 0) ?? 0;

    // Per-category breakdown
    const categoryMap: Record<string, { total: number; correct: number }> = {};
    answers?.forEach((a) => {
      const cat = (a.questions as unknown as { category: string } | null)?.category ?? 'Unknown';
      if (!categoryMap[cat]) categoryMap[cat] = { total: 0, correct: 0 };
      categoryMap[cat].total++;
      if (a.is_correct) categoryMap[cat].correct++;
    });

    // Sort categories by total questions answered
    const categories = Object.entries(categoryMap)
      .map(([name, { total: t, correct: c }]) => ({
        name,
        total: t,
        correct: c,
        accuracy: t > 0 ? Math.round((c / t) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);

    const bestCategory = categories.length > 0
      ? categories.sort((a, b) => b.accuracy - a.accuracy)[0].name
      : null;

    return NextResponse.json({
      total,
      correct,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      totalPoints,
      bestCategory,
      categories,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
