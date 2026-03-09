import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateRoomCode } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      mode,
      categories,
      questionCount,
      timePerQuestion,
      ttsEnabled,
    }: {
      mode: 'solo' | 'multiplayer';
      categories: string[];
      questionCount: number;
      timePerQuestion: number;
      ttsEnabled: boolean;
    } = body;

    if (!mode || !categories?.length || !questionCount || !timePerQuestion) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const admin = createAdminClient();

    // Select random questions matching the requested categories
    // Supabase doesn't support ORDER BY random() in the JS client,
    // so we fetch more than we need and shuffle client-side
    const { data: allQuestions, error: questionsError } = await admin
      .from('questions')
      .select('id')
      .in('category', categories)
      .limit(questionCount * 5);

    if (questionsError) {
      return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
    }

    if (!allQuestions || allQuestions.length === 0) {
      return NextResponse.json({ error: 'No questions found for selected categories' }, { status: 404 });
    }

    // Shuffle and take the requested count
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    const questions = shuffled.slice(0, Math.min(questionCount, shuffled.length));

    // Generate room code for multiplayer
    const roomCode = mode === 'multiplayer' ? generateRoomCode() : null;

    // Create game session
    const { data: session, error: sessionError } = await admin
      .from('game_sessions')
      .insert({
        host_id: user.id,
        mode,
        status: mode === 'solo' ? 'active' : 'lobby',
        categories,
        question_count: questions.length,
        time_per_question: timePerQuestion,
        tts_enabled: ttsEnabled,
        current_question_index: 0,
        room_code: roomCode,
      })
      .select()
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Failed to create game session' }, { status: 500 });
    }

    // Create game_questions rows
    const gameQuestions = questions.map((q, index) => ({
      session_id: session.id,
      question_id: q.id,
      question_index: index,
    }));

    const { error: gqError } = await admin
      .from('game_questions')
      .insert(gameQuestions);

    if (gqError) {
      return NextResponse.json({ error: 'Failed to create game questions' }, { status: 500 });
    }

    // Create game_players row for the host
    const { error: playerError } = await admin
      .from('game_players')
      .insert({
        session_id: session.id,
        user_id: user.id,
        score: 0,
        is_host: true,
      });

    if (playerError) {
      return NextResponse.json({ error: 'Failed to add host as player' }, { status: 500 });
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Game create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
