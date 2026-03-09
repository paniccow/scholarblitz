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

    const { roomCode }: { roomCode: string } = await request.json();

    if (!roomCode) {
      return NextResponse.json({ error: 'Room code is required' }, { status: 400 });
    }

    const admin = createAdminClient();

    // Find game session by room code
    const { data: session, error: sessionError } = await admin
      .from('game_sessions')
      .select('*')
      .eq('room_code', roomCode.toUpperCase())
      .eq('status', 'lobby')
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Game not found or already started' }, { status: 404 });
    }

    // Check if player already joined
    const { data: existingPlayer } = await admin
      .from('game_players')
      .select('id')
      .eq('session_id', session.id)
      .eq('user_id', user.id)
      .single();

    if (existingPlayer) {
      return NextResponse.json({ session });
    }

    // Add player to game
    const { error: playerError } = await admin
      .from('game_players')
      .insert({
        session_id: session.id,
        user_id: user.id,
        score: 0,
        is_host: false,
      });

    if (playerError) {
      return NextResponse.json({ error: 'Failed to join game' }, { status: 500 });
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Game join error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
