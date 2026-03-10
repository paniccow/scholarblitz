'use client';

import React, { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useGameState } from '@/hooks/useGameState';
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
import { Modal } from '@/components/ui/Modal';

export default function SoloGamePageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><Spinner size="lg" /></div>}>
      <SoloGamePage />
    </Suspense>
  );
}

function SoloGamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');

  const { user, profile } = useAuth();
  const { isPaywalled } = useUsageTracker();

  const [session, setSession] = useState<GameSession | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [revealedWords, setRevealedWords] = useState(0);

  const game = useGameState({
    timePerQuestion: session?.time_per_question ?? 15,
    onTimeUp: undefined,
  });

  const tts = useTTS(game.currentQuestion?.question_text ?? '');

  // Fetch session and questions via API route (avoids RLS issues)
  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided.');
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/game/session?id=${sessionId}`);
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Game session not found.');
          setLoading(false);
          return;
        }

        const { session: sessionData, questions: questionData } = await res.json();
        setSession(sessionData as GameSession);
        setQuestions(questionData as Question[]);
        setLoading(false);
      } catch {
        setError('Failed to load game session.');
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  // Start game when questions are loaded
  useEffect(() => {
    if (questions.length > 0 && game.state === 'idle') {
      game.startGame(questions);
    }
  }, [questions, game]);

  // Progressive reveal effect
  useEffect(() => {
    if (game.state !== 'reading' || !game.currentQuestion) return;

    const words = game.currentQuestion.question_text.split(/\s+/).length;
    const interval = ((session?.time_per_question ?? 15) * 1000) / words;

    setRevealedWords(0);
    let count = 0;

    const timer = setInterval(() => {
      count += 1;
      setRevealedWords(count);
      if (count >= words) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [game.state, game.currentQuestion, game.currentQuestionIndex, session?.time_per_question]);

  // TTS auto-read
  useEffect(() => {
    if (game.state === 'reading' && session?.tts_enabled && game.currentQuestion) {
      tts.speak();
    }
    if (game.state === 'buzzed' || game.state === 'answered' || game.state === 'finished') {
      tts.stop();
    }
  }, [game.state, game.currentQuestionIndex]);

  // Check paywall
  useEffect(() => {
    if (isPaywalled) {
      setShowPaywall(true);
    }
  }, [isPaywalled]);

  // Handle buzz
  const handleBuzz = useCallback(() => {
    if (game.state === 'reading') {
      game.buzz();
    }
  }, [game]);

  // Handle answer submission
  const handleAnswer = useCallback(
    (answer: string) => {
      if (!user) return;
      game.submitAnswer(answer, user.id, profile?.display_name ?? 'Player');
    },
    [game, user, profile]
  );

  // Handle next question
  const handleNext = useCallback(() => {
    game.nextQuestion();
  }, [game]);

  // Handle game end -> results
  const handleFinish = useCallback(async () => {
    if (!sessionId || !user) return;

    const finalScore = game.scores.find((s) => s.userId === user.id)?.score ?? 0;

    await fetch('/api/game/finish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, score: finalScore }),
    });

    router.push(`/play/results?session=${sessionId}`);
  }, [sessionId, user, game.scores, router]);

  // Keyboard shortcut for buzz (spacebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && game.state === 'reading') {
        e.preventDefault();
        handleBuzz();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [game.state, handleBuzz]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <p className="text-red-600">{error}</p>
        <Button onClick={() => router.push('/play/setup')}>Back to Setup</Button>
      </div>
    );
  }

  // Finished state
  if (game.state === 'finished') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Game Over!</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-4xl font-bold text-indigo-600">
              {game.scores.find((s) => s.userId === user?.id)?.score ?? 0}
            </p>
            <p className="mt-1 text-sm text-gray-500">Final Score</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-4xl font-bold text-gray-900">{game.totalQuestions}</p>
            <p className="mt-1 text-sm text-gray-500">Questions</p>
          </div>
        </div>
        {user && (
          <Scoreboard
            players={game.scores}
            currentUserId={user.id}
          />
        )}
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={() => router.push('/dashboard')}>
            Dashboard
          </Button>
          <Button onClick={handleFinish}>View Results</Button>
        </div>
      </div>
    );
  }

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
            onClick={() => {
              tts.stop();
              game.endGame();
              router.push('/play/setup');
            }}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title="Leave game"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Solo Practice</h1>
            <p className="text-sm text-gray-500">
              Question {game.currentQuestionIndex + 1} of {game.totalQuestions}
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

      {/* Question card */}
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
        {game.state === 'reading' && (
          <div className="text-center">
            <Button size="lg" onClick={handleBuzz} className="px-12">
              BUZZ! (Space)
            </Button>
          </div>
        )}

        {game.state === 'buzzed' && (
          <AnswerInput
            onSubmit={handleAnswer}
            placeholder="Type your answer..."
          />
        )}

        {(game.state === 'answered' || game.state === 'revealed') && (
          <div className="space-y-4">
            {/* Feedback */}
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
                    Incorrect. Your answer: &quot;{game.lastAnswer}&quot;
                  </span>
                )}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Answer: <span className="font-medium">{game.currentQuestion?.answer}</span>
              </p>
            </div>

            <div className="flex justify-center">
              <Button onClick={handleNext}>
                {game.currentQuestionIndex + 1 >= game.totalQuestions
                  ? 'Finish Game'
                  : 'Next Question'}
              </Button>
            </div>
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
