'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { GameSession, GamePlayer } from '@/types/game';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

interface RecentGame {
  session: GameSession;
  player: GamePlayer;
}

interface Stats {
  totalQuestions: number;
  correctAnswers: number;
  favoriteCategory: string | null;
}

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalQuestions: 0,
    correctAnswers: 0,
    favoriteCategory: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      const supabase = createClient();

      // Fetch recent games
      const { data: playerData } = await supabase
        .from('game_players')
        .select('*, game_sessions(*)')
        .eq('user_id', user.id)
        .order('joined_at', { ascending: false })
        .limit(5);

      if (playerData) {
        const games: RecentGame[] = playerData.map((p: Record<string, unknown>) => ({
          session: p.game_sessions as unknown as GameSession,
          player: {
            id: p.id,
            session_id: p.session_id,
            user_id: p.user_id,
            score: p.score,
            is_host: p.is_host,
            joined_at: p.joined_at,
            display_name: p.display_name,
          } as GamePlayer,
        }));
        setRecentGames(games);
      }

      // Fetch stats - total games played and aggregate scores
      const { data: allPlayers } = await supabase
        .from('game_players')
        .select('score, game_sessions(question_count, categories)')
        .eq('user_id', user.id);

      if (allPlayers && allPlayers.length > 0) {
        let totalQ = 0;
        let totalScore = 0;
        const categoryCounts: Record<string, number> = {};

        allPlayers.forEach((p: Record<string, unknown>) => {
          const session = p.game_sessions as unknown as GameSession | null;
          totalScore += (p.score as number) || 0;
          if (session) {
            totalQ += session.question_count || 0;
            session.categories?.forEach((cat) => {
              categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
            });
          }
        });

        const favCategory =
          Object.entries(categoryCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? null;

        setStats({
          totalQuestions: totalQ,
          correctAnswers: Math.round(totalScore / 10), // each correct = 10 points
          favoriteCategory: favCategory,
        });
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  const accuracy =
    stats.totalQuestions > 0
      ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100)
      : 0;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {profile?.display_name || 'Player'}
        </h1>
        <p className="mt-1 text-gray-500">Ready to practice?</p>
      </div>

      {/* Quick start */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/play/setup?mode=solo">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-4 py-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Solo Practice</h3>
                <p className="text-sm text-gray-500">Practice at your own pace</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/play/setup?mode=multiplayer">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-4 py-6">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Multiplayer</h3>
                <p className="text-sm text-gray-500">Compete with friends</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-3xl font-bold text-gray-900">{stats.totalQuestions}</p>
            <p className="mt-1 text-sm text-gray-500">Questions Answered</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-3xl font-bold text-gray-900">{accuracy}%</p>
            <p className="mt-1 text-sm text-gray-500">Accuracy</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-3xl font-bold text-gray-900">
              {stats.favoriteCategory || '--'}
            </p>
            <p className="mt-1 text-sm text-gray-500">Favorite Category</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent games */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Games</h2>
            <Link href="/history" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {recentGames.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <p>No games played yet.</p>
              <Link href="/play/setup">
                <Button variant="primary" size="sm" className="mt-3">
                  Start your first game
                </Button>
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentGames.map(({ session, player }) => (
                <li key={player.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {session.mode === 'solo' ? 'Solo Practice' : 'Multiplayer'}{' '}
                      <span className="text-gray-400">
                        ({session.categories?.slice(0, 2).join(', ')}
                        {(session.categories?.length ?? 0) > 2 ? '...' : ''})
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(session.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-indigo-600">{player.score} pts</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
