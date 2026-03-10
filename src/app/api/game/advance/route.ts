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

    const { sessionId, action }: { sessionId: string; action?: string } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const admin = createAdminClient();

    // Fetch session and verify user is host
    const { data: session, error: sessionError } = await admin
      .from('game_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (session.host_id !== user.id) {
      return NextResponse.json({ error: 'Only the host can advance the game' }, { status: 403 });
    }

    // Handle "start" action for multiplayer lobby -> active
    if (action === 'start') {
      const { data: updatedSession, error: updateError } = await admin
        .from('game_sessions')
        .update({ status: 'active' })
        .eq('id', sessionId)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json({ error: 'Failed to start game' }, { status: 500 });
      }

      return NextResponse.json({ session: updatedSession });
    }

    const nextIndex = session.current_question_index + 1;
    const isFinished = nextIndex >= session.question_count;

    // Update session
    const { data: updatedSession, error: updateError } = await admin
      .from('game_sessions')
      .update({
        current_question_index: nextIndex,
        status: isFinished ? 'finished' : session.status,
        ...(isFinished ? { finished_at: new Date().toISOString() } : {}),
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: 'Failed to advance game' }, { status: 500 });
    }

    return NextResponse.json({ session: updatedSession });
  } catch (error) {
    console.error('Game advance error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
