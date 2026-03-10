import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionId = request.nextUrl.searchParams.get('id');
    const roomCode = request.nextUrl.searchParams.get('roomCode');

    if (!sessionId && !roomCode) {
      return NextResponse.json({ error: 'Missing session ID or room code' }, { status: 400 });
    }

    const admin = createAdminClient();

    // Fetch session by ID or room code
    let sessionQuery = admin.from('game_sessions').select('*');
    if (sessionId) {
      sessionQuery = sessionQuery.eq('id', sessionId);
    } else {
      sessionQuery = sessionQuery.eq('room_code', roomCode!);
    }
    const { data: session, error: sessionError } = await sessionQuery.single();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Game session not found' }, { status: 404 });
    }

    // Verify user is a player in this session (skip for multiplayer lobby join)
    const { data: player } = await admin
      .from('game_players')
      .select('id')
      .eq('session_id', session.id)
      .eq('user_id', user.id)
      .single();

    // If not a player and it's a multiplayer lobby, auto-join
    if (!player && session.mode === 'multiplayer' && session.status === 'lobby') {
      await admin.from('game_players').insert({
        session_id: session.id,
        user_id: user.id,
        score: 0,
        is_host: false,
      });
    } else if (!player) {
      return NextResponse.json({ error: 'Not a player in this session' }, { status: 403 });
    }

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Game session not found' }, { status: 404 });
    }

    // Fetch questions in order
    const { data: gameQuestions, error: questionsError } = await admin
      .from('game_questions')
      .select('question_index, questions(*)')
      .eq('session_id', session.id)
      .order('question_index', { ascending: true });

    if (questionsError) {
      return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 });
    }

    const questions = gameQuestions?.map(
      (gq: Record<string, unknown>) => gq.questions
    ) ?? [];

    return NextResponse.json({ session, questions });
  } catch (error) {
    console.error('Game session fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
