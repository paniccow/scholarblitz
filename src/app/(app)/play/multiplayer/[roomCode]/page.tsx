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

  const [phase, setPhase] = useState<Phase>('lobby');
  const [session, setSession] = useState<GameSession | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [wrongFeedback, setWrongFeedback] = useState<string | null>(null);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [revealedWords, setRevealedWords] = useState(0);

  const realtime = useRealtimeGame(roomCode);

  const game = useGameState({
    timePerQuestion: session?.time_per_question ?? 15,
  });

  const isActivePlaying = phase === 'playing' && game.state !== 'idle' && game.state !== 'finished';
  const { isPaywalled } = useUsageTracker(isActivePlaying);

  const tts = useTTS(game.currentQuestion?.question_text ?? '');

  // Fetch session
  useEffect(() => {
    if (!user) return;
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
        setIsHost(typedSession.host_id === user.id);
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
    fetchSession();
  }, [roomCode, user]);

  // Track presence whenever user/profile/isHost changes — hook queues it if channel not ready yet
  useEffect(() => {
    if (!user) return;
    const displayName = profile?.display_name ?? user.email?.split('@')[0] ?? 'Player';
    realtime.trackPresence({
      userId: user.id,
      displayName,
      isHost,
      joinedAt: new Date().toISOString(),
    });
  }, [user, profile, isHost]);

  const loadQuestions = useCallback(async (sessionId: string) => {
    const res = await fetch(`/api/game/session?id=${sessionId}`);
    if (res.ok) {
      const { questions: questionData } = await res.json();
      setQuestions(questionData as Question[]);
    }
  }, []);

  // Listen for game events
  useEffect(() => {
    const unsubs: (() => void)[] = [];

    unsubs.push(realtime.onEvent('game_start', async (payload) => {
      await loadQuestions(payload.sessionId as string);
      setPhase('playing');
    }));

    // Answer: first correct answer wins
    unsubs.push(realtime.onEvent('answer', (payload) => {
      game.openAnswer(
        payload.answer as string,
        payload.userId as string,
        payload.displayName as string,
      );
    }));

    // Reveal: timer ran out, show answer without points
    unsubs.push(realtime.onEvent('reveal', () => {
      game.revealTimeUp();
    }));

    unsubs.push(realtime.onEvent('next', () => {
      game.nextQuestion();
    }));

    unsubs.push(realtime.onEvent('game_end', () => {
      setPhase('finished');
    }));

    return () => unsubs.forEach((u) => u());
  }, [realtime, game, loadQuestions]);

  // Start game when questions loaded
  useEffect(() => {
    if (questions.length > 0 && game.state === 'idle' && phase === 'playing') {
      game.startGame(questions);
    }
  }, [questions, game, phase]);

  // Progressive word reveal
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
    if (game.state === 'reading' && session?.tts_enabled) tts.speak();
    if (game.state !== 'reading') tts.stop();
  }, [game.state, game.currentQuestionIndex]);

  // Paywall
  useEffect(() => {
    if (isPaywalled) setShowPaywall(true);
  }, [isPaywalled]);

  // Host starts game
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
  }, [session, user, realtime, loadQuestions]);

  // Reset guess lock on each new question
  useEffect(() => {
    if (game.state === 'reading') setHasGuessed(false);
  }, [game.currentQuestionIndex, game.state]);

  // Any player submits an answer (open answering — one guess per question)
  const handleAnswer = useCallback((answer: string) => {
    if (!user || game.state !== 'reading' || hasGuessed) return;

    const displayName = profile?.display_name ?? user.email?.split('@')[0] ?? 'Player';
    const isCorrect = game.openAnswer(answer, user.id, displayName);

    if (isCorrect) {
      realtime.broadcast('answer', { answer, userId: user.id, displayName });
    } else {
      setHasGuessed(true);
      setWrongFeedback('Wrong — you can\'t guess again this round.');
    }
  }, [user, profile, game, realtime, hasGuessed]);

  // Host reveals when timer runs out
  const handleReveal = useCallback(() => {
    realtime.broadcast('reveal', {});
    game.revealTimeUp();
  }, [realtime, game]);

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

  const handleLeave = useCallback(() => {
    tts.stop();
    router.push('/play/setup');
  }, [tts, router]);

  const timerEnabled = (session?.time_per_question ?? 0) > 0;
  const timerUp = timerEnabled && game.state === 'reading' && game.timer.timeLeft === 0;

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
        <p className="text-red-600 font-medium">{error}</p>
        <Button onClick={() => router.push('/play/setup')}>Back to Setup</Button>
      </div>
    );
  }

  // LOBBY
  if (phase === 'lobby') {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleLeave}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-black">Game Lobby</h1>
          <div className="w-9" />
        </div>

        <div className="text-center">
          <p className="text-gray-600 font-medium">Share this code with friends:</p>
          <p className="mt-2 text-5xl font-mono font-bold text-black tracking-[0.3em]">
            {roomCode}
          </p>
        </div>

        <Card>
          <CardContent>
            <h2 className="text-sm font-semibold text-black uppercase tracking-wide mb-3">
              Players ({realtime.players.length})
            </h2>
            <ul className="divide-y divide-gray-100">
              {realtime.players.map((p) => (
                <li key={p.userId} className="flex items-center justify-between py-3">
                  <span className="text-base font-medium text-black">
                    {p.displayName}
                    {p.userId === user?.id && (
                      <span className="ml-2 text-sm text-indigo-500">(you)</span>
                    )}
                  </span>
                  {p.isHost && (
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      Host
                    </span>
                  )}
                </li>
              ))}
              {realtime.players.length === 0 && (
                <li className="py-4 text-sm text-gray-500 text-center">
                  Waiting for players to join...
                </li>
              )}
            </ul>
          </CardContent>
        </Card>

        {isHost ? (
          <Button size="lg" fullWidth onClick={handleStartGame}>
            Start Game ({realtime.players.length} player{realtime.players.length !== 1 ? 's' : ''})
          </Button>
        ) : (
          <p className="text-center text-gray-600 font-medium">Waiting for host to start...</p>
        )}
      </div>
    );
  }

  // FINISHED
  if (phase === 'finished' || game.state === 'finished') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 text-center">
        <h1 className="text-3xl font-bold text-black">Game Over!</h1>
        {user && <Scoreboard players={game.scores} currentUserId={user.id} />}
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={() => router.push('/dashboard')}>Dashboard</Button>
          <Button onClick={() => router.push('/play/setup')}>Play Again</Button>
        </div>
      </div>
    );
  }

  // PLAYING
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Modal isOpen={showPaywall} onClose={() => setShowPaywall(false)} title="Free Limit Reached">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            You&apos;ve used all your free practice time. Upgrade to continue playing unlimited.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => router.push('/dashboard')}>Go Back</Button>
            <Button fullWidth onClick={() => router.push('/settings')}>Upgrade</Button>
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
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-black">Multiplayer</h1>
            <p className="text-sm font-medium text-gray-600">
              Room: <span className="font-mono font-bold">{roomCode}</span> &nbsp;·&nbsp; Q{game.currentQuestionIndex + 1}/{game.totalQuestions}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {session?.tts_enabled && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={tts.isReading ? tts.stop : tts.speak}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                title={tts.isReading ? 'Stop reading' : 'Read aloud'}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d={tts.isReading
                      ? "M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                      : "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"}
                  />
                </svg>
              </button>
              {tts.voices.length > 1 && (
                <select
                  value={tts.selectedVoice?.name ?? ''}
                  onChange={(e) => {
                    const voice = tts.voices.find((v) => v.name === e.target.value);
                    if (voice) tts.setVoice(voice);
                  }}
                  className="text-xs border border-gray-300 rounded-md px-1.5 py-1 text-black max-w-[120px]"
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
                className="text-xs border border-gray-300 rounded-md px-1.5 py-1 text-black"
              >
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
              </select>
            </div>
          )}
          <Timer timeLeft={game.timer.timeLeft} totalTime={session?.time_per_question ?? 15} />
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
      <div className="space-y-3">

        {/* Open answer input — one guess per question */}
        {game.state === 'reading' && !timerUp && (
          <div className="space-y-2">
            {!hasGuessed ? (
              <AnswerInput onSubmit={handleAnswer} placeholder="Type your answer and press Enter..." />
            ) : (
              <p className="text-sm font-semibold text-red-600 text-center bg-red-50 rounded-lg px-3 py-2">{wrongFeedback}</p>
            )}
          </div>
        )}

        {/* Timer ran out — host reveals */}
        {timerUp && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-center space-y-3">
            <p className="font-bold text-black text-lg">Time&apos;s up!</p>
            {isHost && (
              <Button onClick={handleReveal} className="bg-amber-600 hover:bg-amber-700">
                Reveal Answer
              </Button>
            )}
            {!isHost && (
              <p className="text-gray-700 font-medium">Waiting for host to reveal...</p>
            )}
          </div>
        )}

        {/* No timer — host can reveal at any time */}
        {!timerEnabled && game.state === 'reading' && isHost && (
          <div className="flex justify-end">
            <Button variant="secondary" size="sm" onClick={handleReveal}>
              Reveal Answer
            </Button>
          </div>
        )}

        {/* Answer result */}
        {(game.state === 'answered' || game.state === 'revealed') && (
          <div className="space-y-3">
            <div className={`rounded-xl p-4 border ${
              game.state === 'revealed' && game.lastAnswer === null
                ? 'bg-gray-50 border-gray-200'
                : game.lastCorrect
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              {game.state === 'revealed' && game.lastAnswer === null ? (
                <p className="font-bold text-black text-lg">Nobody got it.</p>
              ) : game.lastCorrect ? (
                <p className="font-bold text-green-700 text-lg">
                  Correct! +10 points
                </p>
              ) : (
                <p className="font-bold text-red-700 text-lg">Incorrect.</p>
              )}
              <p className="mt-2 text-base font-medium text-black">
                Answer: <span className="font-bold">{game.currentQuestion?.answer}</span>
              </p>
            </div>

            {isHost && (
              <div className="flex justify-center gap-3">
                <Button size="lg" onClick={handleNext}>
                  {game.currentQuestionIndex + 1 >= game.totalQuestions ? 'End Game' : 'Next Question →'}
                </Button>
                {game.currentQuestionIndex + 1 >= game.totalQuestions && (
                  <Button variant="secondary" onClick={handleEndGame}>Finish</Button>
                )}
              </div>
            )}
            {!isHost && (
              <p className="text-center text-gray-600 font-medium">Waiting for host to continue...</p>
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
