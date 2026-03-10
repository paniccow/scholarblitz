'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { GameSession, GamePlayer } from '@/types/game';
import { Scoreboard } from '@/components/game/Scoreboard';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

interface ResultData {
  session: GameSession;
  players: GamePlayer[];
}

export default function ResultsPageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><Spinner size="lg" /></div>}>
      <ResultsPage />
    </Suspense>
  );
}

function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');
  const { user } = useAuth();

  const [data, setData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided.');
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      const supabase = createClient();

      const { data: sessionData, error: sessionError } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError || !sessionData) {
        setError('Game session not found.');
        setLoading(false);
        return;
      }

      const { data: playerData, error: playerError } = await supabase
        .from('game_players')
        .select('*')
        .eq('session_id', sessionId)
        .order('score', { ascending: false });

      if (playerError) {
        setError('Failed to load results.');
        setLoading(false);
        return;
      }

      setData({
        session: sessionData as GameSession,
        players: (playerData ?? []) as GamePlayer[],
      });
      setLoading(false);
    };

    fetchResults();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <p className="text-red-600">{error || 'No data found.'}</p>
        <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  const { session, players } = data;
  const currentPlayer = players.find((p) => p.user_id === user?.id);
  const rank = players.findIndex((p) => p.user_id === user?.id) + 1;

  const scoreboardPlayers = players.map((p) => ({
    userId: p.user_id,
    displayName: p.display_name ?? 'Player',
    score: p.score,
  }));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Results</h1>
        <p className="mt-1 text-gray-500">
          {session.mode === 'solo' ? 'Solo Practice' : 'Multiplayer'} -{' '}
          {new Date(session.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="text-center py-5">
            <p className="text-2xl font-bold text-indigo-600">
              {currentPlayer?.score ?? 0}
            </p>
            <p className="mt-1 text-xs text-gray-500">Your Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-5">
            <p className="text-2xl font-bold text-gray-900">
              {session.question_count}
            </p>
            <p className="mt-1 text-xs text-gray-500">Questions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-5">
            <p className="text-2xl font-bold text-gray-900">
              {players.length}
            </p>
            <p className="mt-1 text-xs text-gray-500">Players</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-5">
            <p className="text-2xl font-bold text-amber-600">
              #{rank || '--'}
            </p>
            <p className="mt-1 text-xs text-gray-500">Your Rank</p>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Categories
          </h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {session.categories.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scoreboard */}
      {user && scoreboardPlayers.length > 0 && (
        <Scoreboard players={scoreboardPlayers} currentUserId={user.id} />
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <Button variant="secondary" onClick={() => router.push('/dashboard')}>
          Dashboard
        </Button>
        <Button variant="secondary" onClick={() => router.push('/history')}>
          Game History
        </Button>
        <Button onClick={() => router.push('/play/setup')}>Play Again</Button>
      </div>
    </div>
  );
}
