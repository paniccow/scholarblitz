'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { GameSession, GamePlayer } from '@/types/game';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

interface HistoryEntry {
  session: GameSession;
  player: GamePlayer;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      const supabase = createClient();

      const { data, error: fetchError } = await supabase
        .from('game_players')
        .select('*, game_sessions(*)')
        .eq('user_id', user.id)
        .order('joined_at', { ascending: false })
        .limit(50);

      if (fetchError) {
        setError('Failed to load game history.');
        setLoading(false);
        return;
      }

      if (data) {
        const history: HistoryEntry[] = data.map((row: Record<string, unknown>) => ({
          session: row.game_sessions as unknown as GameSession,
          player: {
            id: row.id,
            session_id: row.session_id,
            user_id: row.user_id,
            score: row.score,
            is_host: row.is_host,
            joined_at: row.joined_at,
            display_name: row.display_name,
          } as GamePlayer,
        }));
        setEntries(history);
      }

      setLoading(false);
    };

    fetchHistory();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <p className="text-red-600">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Game History</h1>
          <p className="mt-1 text-gray-500">
            {entries.length} game{entries.length !== 1 ? 's' : ''} played
          </p>
        </div>
        <Link href="/play/setup">
          <Button>New Game</Button>
        </Link>
      </div>

      {entries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No games played yet.</p>
            <Link href="/play/setup">
              <Button variant="primary" size="sm" className="mt-4">
                Start your first game
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-5 gap-4 px-6 py-3 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <span>Date</span>
              <span>Mode</span>
              <span>Categories</span>
              <span className="text-right">Score</span>
              <span className="text-right">Actions</span>
            </div>

            <ul className="divide-y divide-gray-100">
              {entries.map(({ session, player }) => (
                <li key={player.id}>
                  {/* Desktop row */}
                  <div className="hidden sm:grid grid-cols-5 gap-4 items-center px-6 py-4">
                    <span className="text-sm text-gray-700">
                      {new Date(session.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          session.mode === 'solo'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-green-50 text-green-700'
                        }`}
                      >
                        {session.mode === 'solo' ? 'Solo' : 'Multi'}
                      </span>
                    </span>
                    <span className="text-sm text-gray-600 truncate">
                      {session.categories?.slice(0, 3).join(', ')}
                      {(session.categories?.length ?? 0) > 3 ? '...' : ''}
                    </span>
                    <span className="text-sm font-bold text-indigo-600 text-right">
                      {player.score} pts
                    </span>
                    <span className="text-right">
                      <Link
                        href={`/play/results?session=${session.id}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Details
                      </Link>
                    </span>
                  </div>

                  {/* Mobile card */}
                  <div className="sm:hidden px-6 py-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">
                        {new Date(session.created_at).toLocaleDateString()}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          session.mode === 'solo'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-green-50 text-green-700'
                        }`}
                      >
                        {session.mode === 'solo' ? 'Solo' : 'Multi'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {session.categories?.join(', ')}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-indigo-600">
                        {player.score} pts
                      </span>
                      <Link
                        href={`/play/results?session=${session.id}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
