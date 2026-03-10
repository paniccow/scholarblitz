'use client';

import React, { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useGameState } from '@/hooks/useGameState';
import { useRealtimeGame } from '@/hooks/useRealtimeGame';
import { useTTS } from '@/hooks/useTTS';
import { useUsageTracker } from '@/hooks/useUsageTracker';
import { GameSession } from '@/types/game';
import { Question } from '@/types/question';
import { QuestionCard } from '@/components/game/QuestionCard';
import { Timer } from '@/components/game/Timer';
import { AnswerInput } from '@/components/game/AnswerInput';
import { Scoreboard } from '@/components/game/Scoreboard';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';

type Phase = 'lobby' | 'playing' | 'finished';

export default function MultiplayerGamePage({
  params,
}: {
  params: Promise<{ roomCode: string }>;
}) {
  const { roomCode } = use(params);
  const router = useRouter();
  const { user, profile } = useAuth();
  const { isPaywalled } = useUsageTracker();

  const [phase, setPhase] = useState<Phase>('lobby');
  const [session, setSession] = useState<GameSession | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buzzedPlayer, setBuzzedPlayer] = useState<string | null>(null);
  const [revealedWords, setRevealedWords] = useState(0);
  const [isHost, setIsHost] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  const realtime = useRealtimeGame(roomCode);

  const game = useGameState({
    timePerQuestion: session?.time_per_question ?? 15,
  });

  const tts = useTTS(game.currentQuestion?.question_text ?? '');

  // Fetch session info via API
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/game/session?roomCode=${roomCode}`);
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Room not found.');
          setLoading(false);
          return;
        }

        const { session: sessionData, questions: questionData } = await res.json();
        const typedSession = sessionData as GameSession;
        setSession(typedSession);
        setIsHost(typedSession.host_id === user?.id);

        if (typedSession.status === 'active') {
          setQuestions(questionData as Question[]);
          setPhase('playing');
        } else if (typedSession.status === 'finished') {
          setPhase('finished');
        }

        setLoading(false);
      } catch {
        setError('Failed to load room.');
        setLoading(false);
      }
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
    try {
      const res = await fetch(`/api/game/session?id=${sessionId}`);
      if (res.ok) {
        const { questions: questionData } = await res.json();
        setQuestions(questionData as Question[]);
      }
    } catch {
      console.error('Failed to load questions');
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

  // TTS - each client plays independently
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

    await fetch('/api/game/advance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: session.id, action: 'start' }),
    });

    realtime.broadcast('game_start', { sessionId: session.id });
    await loadQuestions(session.id);
    setPhase('playing');
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

    await fetch('/api/game/finish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: session.id, score: 0 }),
    });

    realtime.broadcast('game_end', {});
    setPhase('finished');
  }, [session, realtime]);

  // Leave game
  const handleLeave = useCallback(() => {
    tts.stop();
    router.push('/play/setup');
  }, [tts, router]);

  // Check paywall
  useEffect(() => {
    if (isPaywalled) setShowPaywall(true);
  }, [isPaywalled]);

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
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleLeave}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title="Leave room"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Game Lobby</h1>
          </div>
          <div className="w-9" />
        </div>

        <div>
          <p className="text-gray-500">Share this code with friends:</p>
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
          <Button onClick={() => router.push('/play/setup')}>
            Play Again
          </Button>
        </div>
      </div>
    );
  }

  // PLAYING PHASE
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Paywall modal */}
      <Modal isOpen={showPaywall} onClose={() => setShowPaywall(false)} title="Free Limit Reached">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            You&apos;ve used all your free practice time. Upgrade to continue playing unlimited.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => router.push('/dashboard')}>
              Go Back
            </Button>
            <Button fullWidth onClick={() => router.push('/settings')}>
              Upgrade
            </Button>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLeave}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title="Leave game"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Multiplayer</h1>
            <p className="text-sm text-gray-500">
              Room: {roomCode} | Q{game.currentQuestionIndex + 1}/{game.totalQuestions}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* TTS Controls */}
          {session?.tts_enabled && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={tts.isReading ? tts.stop : tts.speak}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                title={tts.isReading ? 'Stop reading' : 'Read aloud'}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {tts.isReading ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  )}
                </svg>
              </button>
              {tts.voices.length > 1 && (
                <select
                  value={tts.selectedVoice?.name ?? ''}
                  onChange={(e) => {
                    const voice = tts.voices.find((v) => v.name === e.target.value);
                    if (voice) tts.setVoice(voice);
                  }}
                  className="text-xs border border-gray-200 rounded-md px-1.5 py-1 text-gray-600 max-w-[120px]"
                >
                  {tts.voices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name.replace(/Microsoft |Google |Apple /, '')}
                    </option>
                  ))}
                </select>
              )}
              <select
                value={tts.rate}
                onChange={(e) => tts.setSpeed(Number(e.target.value) as 0.75 | 1 | 1.25 | 1.5)}
                className="text-xs border border-gray-200 rounded-md px-1.5 py-1 text-gray-600"
              >
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
              </select>
            </div>
          )}
          <Timer
            timeLeft={game.timer.timeLeft}
            totalTime={session?.time_per_question ?? 15}
          />
        </div>
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
