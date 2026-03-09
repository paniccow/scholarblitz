'use client';

import { useState, useCallback } from 'react';
import { GameState, PlayerScore } from '@/types/game';
import { Question } from '@/types/question';
import { useTimer } from '@/hooks/useTimer';

const DEFAULT_TIME_PER_QUESTION = 30;

interface UseGameStateOptions {
  timePerQuestion?: number;
  onTimeUp?: () => void;
}

export function useGameState(options: UseGameStateOptions = {}) {
  const { timePerQuestion = DEFAULT_TIME_PER_QUESTION } = options;

  const [state, setState] = useState<GameState>('idle');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<PlayerScore[]>([]);
  const [lastAnswer, setLastAnswer] = useState<string | null>(null);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);

  const timer = useTimer(timePerQuestion);

  const currentQuestion = questions[currentQuestionIndex] ?? null;

  const startGame = useCallback(
    (questionList: Question[]) => {
      if (questionList.length === 0) return;

      setQuestions(questionList);
      setCurrentQuestionIndex(0);
      setScores([]);
      setLastAnswer(null);
      setLastCorrect(null);
      setState('reading');
      timer.reset(timePerQuestion);
      timer.start();
    },
    [timer, timePerQuestion]
  );

  const buzz = useCallback(() => {
    if (state !== 'reading') return;
    timer.stop();
    setState('buzzed');
  }, [state, timer]);

  const submitAnswer = useCallback(
    (answer: string, userId?: string, displayName?: string) => {
      if (state !== 'buzzed') return;

      const question = questions[currentQuestionIndex];
      if (!question) return;

      // Check if answer matches (case-insensitive, including aliases)
      const normalizedAnswer = answer.trim().toLowerCase();
      const correctAnswers = [
        question.answer.toLowerCase(),
        ...question.answer_aliases.map((a) => a.toLowerCase()),
      ];
      const isCorrect = correctAnswers.some(
        (correct) =>
          correct === normalizedAnswer || correct.includes(normalizedAnswer)
      );

      setLastAnswer(answer);
      setLastCorrect(isCorrect);

      if (isCorrect && userId) {
        setScores((prev) => {
          const existing = prev.find((s) => s.userId === userId);
          if (existing) {
            return prev.map((s) =>
              s.userId === userId ? { ...s, score: s.score + 10 } : s
            );
          }
          return [
            ...prev,
            { userId, displayName: displayName ?? 'Player', score: 10 },
          ];
        });
      }

      setState('answered');
    },
    [state, questions, currentQuestionIndex]
  );

  const revealAnswer = useCallback(() => {
    if (state !== 'answered') return;
    setState('revealed');
  }, [state]);

  const nextQuestion = useCallback(() => {
    if (state !== 'answered' && state !== 'revealed') return;

    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex >= questions.length) {
      setState('finished');
      return;
    }

    setCurrentQuestionIndex(nextIndex);
    setLastAnswer(null);
    setLastCorrect(null);
    setState('reading');
    timer.reset(timePerQuestion);
    timer.start();
  }, [state, currentQuestionIndex, questions.length, timer, timePerQuestion]);

  const endGame = useCallback(() => {
    timer.stop();
    setState('finished');
  }, [timer]);

  const resetGame = useCallback(() => {
    timer.reset();
    setState('idle');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScores([]);
    setLastAnswer(null);
    setLastCorrect(null);
  }, [timer]);

  return {
    state,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions: questions.length,
    scores,
    lastAnswer,
    lastCorrect,
    timer,
    startGame,
    buzz,
    submitAnswer,
    revealAnswer,
    nextQuestion,
    endGame,
    resetGame,
  };
}
