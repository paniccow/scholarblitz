'use client';

import React, { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useGameState } from '@/hooks/useGameState';
import { useRealtimeGame } from '@/hooks/useRealtimeGame';
import { useTTS } from '@/hooks/useTTS';
import { GameSession } from '@/types/game';
import { Question } from '@/types/question';
import { QuestionCard } from '@/components/game/QuestionCard';
import { Timer } from '@/components/game/Timer';
import { AnswerInput } from '@/components/game/AnswerInput';
import { Scoreboard } from '@/components/game/Scoreboard';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Card, CardContent } from '@/components/ui/Card';

type Phase = 'lobby' | 'playing' | 'finished';

export default function MultiplayerGamePage({
  params,
}: {
  params: Promise<{ roomCode: string }>;
}) {
  const { roomCode } = use(params);
  const router = useRouter();
  const { user, profile } = useAuth();

  const [phase, setPhase] = useState<Phase>('lobby');
  const [session, setSession] = useState<GameSession | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buzzedPlayer, setBuzzedPlayer] = useState<string | null>(null);
  const [revealedWords, setRevealedWords] = useState(0);
  const [isHost, setIsHost] = useState(false);

  const realtime = useRealtimeGame(roomCode);

  const game = useGameState({
    timePerQuestion: session?.time_per_question ?? 15,
  });

  const tts = useTTS(game.currentQuestion?.question_text ?? '');

  // Fetch session info
  useEffect(() => {
    const fetchSession = async () => {
      const supabase = createClient();

      const { data: sessionData, error: sessionError } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('room_code', roomCode)
        .single();

      if (sessionError || !sessionData) {
        setError('Room not found.');
        setLoading(false);
        return;
      }

      const typedSession = sessionData as GameSession;
      setSession(typedSession);
      setIsHost(typedSession.host_id === user?.id);

      if (typedSession.status === 'active') {
        // Game already started, load questions and join
        await loadQuestions(typedSession.id);
        setPhase('playing');
      } else if (typedSession.status === 'finished') {
        setPhase('finished');
      }

      setLoading(false);
    };

    if (user) {
      fetchSession();
    }
  }, [roomCode, user]);

  // Track presence in lobby
  useEffect(() => {
    if (!user || !profile || !realtime.channel) return;

    realtime.trackPresence({
      userId: user.id,
      displayName: profile.display_name ?? 'Player',
      isHost,
      joinedAt: new Date().toISOString(),
    });
  }, [user, profile, realtime.channel, isHost]);

  // Listen for game events
  useEffect(() => {
    const unsubs: (() => void)[] = [];

    // Game start
    unsubs.push(
      realtime.onEvent('game_start', async (payload) => {
        const sid = payload.sessionId as string;
        await loadQuestions(sid);
        setPhase('playing');
      })
    );

    // Buzz
    unsubs.push(
      realtime.onEvent('buzz', (payload) => {
        const buzzUserId = payload.userId as string;
        setBuzzedPlayer(buzzUserId);
        game.buzz();
      })
    );

    // Answer result
    unsubs.push(
      realtime.onEvent('answer', (payload) => {
        const answer = payload.answer as string;
        const userId = payload.userId as string;
        const displayName = payload.displayName as string;
        game.submitAnswer(answer, userId, displayName);
        setBuzzedPlayer(null);
      })
    );

    // Next question
    unsubs.push(
      realtime.onEvent('next', () => {
        game.nextQuestion();
        setBuzzedPlayer(null);
      })
    );

    // Game end
    unsubs.push(
      realtime.onEvent('game_end', () => {
        setPhase('finished');
      })
    );

    return () => unsubs.forEach((u) => u());
  }, [realtime, game]);

  const loadQuestions = async (sessionId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from('game_questions')
      .select('questions(*)')
      .eq('session_id', sessionId)
      .order('question_index', { ascending: true });

    if (data) {
      const loaded = data.map(
        (q: Record<string, unknown>) => q.questions as unknown as Question
      );
      setQuestions(loaded);
    }
  };

  // Progressive reveal
  useEffect(() => {
    if (game.state !== 'reading' || !game.currentQuestion) return;

    const words = game.currentQuestion.question_text.split(/\s+/).length;
    const interval = ((session?.time_per_question ?? 15) * 1000) / words;

    setRevealedWords(0);
    let count = 0;

    const timer = setInterval(() => {
      count += 1;
      setRevealedWords(count);
      if (count >= words) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [game.state, game.currentQuestion, game.currentQuestionIndex, session?.time_per_question]);

  // TTS
  useEffect(() => {
    if (game.state === 'reading' && session?.tts_enabled) {
      tts.speak();
    }
    if (game.state !== 'reading') {
      tts.stop();
    }
  }, [game.state, game.currentQuestionIndex]);

  // Start game once questions loaded
  useEffect(() => {
    if (questions.length > 0 && game.state === 'idle' && phase === 'playing') {
      game.startGame(questions);
    }
  }, [questions, game, phase]);

  // Host starts the game
  const handleStartGame = useCallback(async () => {
    if (!session || !user) return;

    const supabase = createClient();
    await supabase
      .from('game_sessions')
      .update({ status: 'active' })
      .eq('id', session.id);

    realtime.broadcast('game_start', { sessionId: session.id });
  }, [session, user, realtime]);

  // Player buzzes
  const handleBuzz = useCallback(() => {
    if (!user || game.state !== 'reading') return;
    realtime.broadcast('buzz', {
      userId: user.id,
      displayName: profile?.display_name ?? 'Player',
    });
  }, [user, profile, game.state, realtime]);

  // Player submits answer
  const handleAnswer = useCallback(
    (answer: string) => {
      if (!user) return;
      realtime.broadcast('answer', {
        answer,
        userId: user.id,
        displayName: profile?.display_name ?? 'Player',
      });
    },
    [user, profile, realtime]
  );

  // Host advances to next question
  const handleNext = useCallback(() => {
    realtime.broadcast('next', {});
  }, [realtime]);

  // Host ends game
  const handleEndGame = useCallback(async () => {
    if (!session) return;

    const supabase = createClient();
    await supabase
      .from('game_sessions')
      .update({ status: 'finished', finished_at: new Date().toISOString() })
      .eq('id', session.id);

    realtime.broadcast('game_end', {});
  }, [session, realtime]);

  // Keyboard shortcut for buzz
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && game.state === 'reading' && !buzzedPlayer) {
        e.preventDefault();
        handleBuzz();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [game.state, buzzedPlayer, handleBuzz]);

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
        <Button onClick={() => router.push('/play/setup')}>Back to Setup</Button>
      </div>
    );
  }

  // LOBBY PHASE
  if (phase === 'lobby') {
    return (
      <div className="max-w-lg mx-auto space-y-6 text-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Game Lobby</h1>
          <p className="mt-2 text-gray-500">Share this code with friends:</p>
          <p className="mt-2 text-4xl font-mono font-bold text-indigo-600 tracking-[0.3em]">
            {roomCode}
          </p>
        </div>

        <Card>
          <CardContent>
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Players ({realtime.players.length})
            </h2>
            <ul className="divide-y divide-gray-100">
              {realtime.players.map((p) => (
                <li key={p.userId} className="flex items-center justify-between py-3">
                  <span className="text-sm font-medium text-gray-900">
                    {p.displayName}
                    {p.userId === user?.id && (
                      <span className="ml-1 text-xs text-indigo-500">(you)</span>
                    )}
                  </span>
                  {p.isHost && (
                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      Host
                    </span>
                  )}
                </li>
              ))}
              {realtime.players.length === 0 && (
                <li className="py-3 text-sm text-gray-400">Waiting for players...</li>
              )}
            </ul>
          </CardContent>
        </Card>

        {isHost ? (
          <Button
            size="lg"
            fullWidth
            onClick={handleStartGame}
            disabled={realtime.players.length < 1}
          >
            Start Game
          </Button>
        ) : (
          <p className="text-sm text-gray-500">Waiting for host to start the game...</p>
        )}
      </div>
    );
  }

  // FINISHED PHASE
  if (phase === 'finished' || game.state === 'finished') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Game Over!</h1>
        {user && (
          <Scoreboard players={game.scores} currentUserId={user.id} />
        )}
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={() => router.push('/dashboard')}>
            Dashboard
          </Button>
          <Button onClick={() => router.push(`/play/results?session=${session?.id}`)}>
            View Results
          </Button>
        </div>
      </div>
    );
  }

  // PLAYING PHASE
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Multiplayer</h1>
          <p className="text-sm text-gray-500">
            Room: {roomCode} | Q{game.currentQuestionIndex + 1}/{game.totalQuestions}
          </p>
        </div>
        <Timer
          timeLeft={game.timer.timeLeft}
          totalTime={session?.time_per_question ?? 15}
        />
      </div>

      {/* Question */}
      {game.currentQuestion && (
        <QuestionCard
          questionText={game.currentQuestion.question_text}
          isRevealing={game.state === 'reading'}
          revealedWordCount={revealedWords}
          category={game.currentQuestion.category}
          questionNumber={game.currentQuestionIndex + 1}
          totalQuestions={game.totalQuestions}
        />
      )}

      {/* Game controls */}
      <div className="space-y-4">
        {game.state === 'reading' && !buzzedPlayer && (
          <div className="text-center">
            <Button
              size="lg"
              onClick={handleBuzz}
              className="px-12 bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              BUZZ! (Space)
            </Button>
          </div>
        )}

        {game.state === 'reading' && buzzedPlayer && buzzedPlayer !== user?.id && (
          <div className="text-center">
            <p className="text-sm text-amber-600 font-medium">
              Another player buzzed in...
            </p>
          </div>
        )}

        {game.state === 'buzzed' && buzzedPlayer === user?.id && (
          <AnswerInput onSubmit={handleAnswer} placeholder="Type your answer..." />
        )}

        {game.state === 'buzzed' && buzzedPlayer !== user?.id && (
          <div className="text-center">
            <p className="text-sm text-gray-500">
              {realtime.players.find((p) => p.userId === buzzedPlayer)?.displayName ?? 'A player'}{' '}
              is answering...
            </p>
          </div>
        )}

        {(game.state === 'answered' || game.state === 'revealed') && (
          <div className="space-y-4">
            <div
              className={`rounded-xl p-4 ${
                game.lastCorrect
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <p className="text-sm font-medium">
                {game.lastCorrect ? (
                  <span className="text-green-700">Correct!</span>
                ) : (
                  <span className="text-red-700">
                    Incorrect. Answer was: &quot;{game.lastAnswer}&quot;
                  </span>
                )}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Correct answer: <span className="font-medium">{game.currentQuestion?.answer}</span>
              </p>
            </div>

            {isHost && (
              <div className="flex justify-center gap-3">
                <Button onClick={handleNext}>
                  {game.currentQuestionIndex + 1 >= game.totalQuestions
                    ? 'End Game'
                    : 'Next Question'}
                </Button>
                {game.currentQuestionIndex + 1 >= game.totalQuestions && (
                  <Button variant="secondary" onClick={handleEndGame}>
                    End Game
                  </Button>
                )}
              </div>
            )}

            {!isHost && (
              <p className="text-center text-sm text-gray-500">
                Waiting for host to continue...
              </p>
            )}
          </div>
        )}
      </div>

      {/* Scoreboard */}
      {user && game.scores.length > 0 && (
        <Scoreboard players={game.scores} currentUserId={user.id} />
      )}
    </div>
  );
}
