import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId, score } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
    }

    const admin = createAdminClient();

    // Update player score
    await admin
      .from('game_players')
      .update({ score: score ?? 0 })
      .eq('session_id', sessionId)
      .eq('user_id', user.id);

    // Mark session as finished
    await admin
      .from('game_sessions')
      .update({ status: 'finished', finished_at: new Date().toISOString() })
      .eq('id', sessionId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Game finish error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
