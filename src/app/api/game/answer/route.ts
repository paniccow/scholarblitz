import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { fuzzyMatch } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      sessionId,
      questionId,
      answerText,
      timeTakenMs,
    }: {
      sessionId: string;
      questionId: string;
      answerText: string;
      timeTakenMs: number;
    } = await request.json();

    if (!sessionId || !questionId || answerText === undefined || timeTakenMs === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const admin = createAdminClient();

    // Fetch the question
    const { data: question, error: questionError } = await admin
      .from('questions')
      .select('answer, answer_aliases')
      .eq('id', questionId)
      .single();

    if (questionError || !question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Check answer using fuzzy matching
    const isCorrect = fuzzyMatch(answerText, question.answer, question.answer_aliases || []);

    // Calculate points
    let pointsAwarded = 0;
    if (isCorrect) {
      pointsAwarded = 10;
      // Speed bonus: if answered in under 5 seconds, award 5 extra points
      if (timeTakenMs < 5000) {
        pointsAwarded += 5;
      }
    }

    // Insert answer record
    const { error: answerError } = await admin
      .from('answers')
      .insert({
        session_id: sessionId,
        question_id: questionId,
        user_id: user.id,
        answer_text: answerText,
        is_correct: isCorrect,
        time_taken_ms: timeTakenMs,
        points_awarded: pointsAwarded,
      });

    if (answerError) {
      return NextResponse.json({ error: 'Failed to record answer' }, { status: 500 });
    }

    // Update player score
    const { error: scoreError } = await admin.rpc('increment_player_score', {
      p_session_id: sessionId,
      p_user_id: user.id,
      p_points: pointsAwarded,
    });

    // Fallback: if RPC doesn't exist, update directly
    if (scoreError) {
      const { data: player } = await admin
        .from('game_players')
        .select('id, score')
        .eq('session_id', sessionId)
        .eq('user_id', user.id)
        .single();

      if (player) {
        await admin
          .from('game_players')
          .update({ score: player.score + pointsAwarded })
          .eq('id', player.id);
      }
    }

    return NextResponse.json({
      isCorrect,
      correctAnswer: question.answer,
      pointsAwarded,
    });
  } catch (error) {
    console.error('Game answer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
