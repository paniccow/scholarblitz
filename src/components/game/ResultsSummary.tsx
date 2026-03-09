'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export interface ResultsPlayer {
  userId: string;
  displayName: string;
  score: number;
  correctCount: number;
  totalAnswered: number;
}

export interface ResultsSummaryProps {
  players: ResultsPlayer[];
  questionsAnswered: number;
  correctCount: number;
  accuracyPercentage: number;
  onPlayAgain?: () => void;
}

const RANK_BADGES = ['bg-yellow-100 text-yellow-700 border-yellow-300', 'bg-gray-100 text-gray-600 border-gray-300', 'bg-orange-100 text-orange-700 border-orange-300'];

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  players,
  questionsAnswered,
  correctCount,
  accuracyPercentage,
  onPlayAgain,
}) => {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 text-center border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">Game Over</h2>
        <p className="text-sm text-gray-500 mt-1">Here are the results</p>
      </div>

      {/* Overall stats */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
        <div className="px-4 py-4 text-center">
          <p className="text-2xl font-bold text-gray-900 tabular-nums">
            {questionsAnswered}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Answered</p>
        </div>
        <div className="px-4 py-4 text-center">
          <p className="text-2xl font-bold text-green-600 tabular-nums">
            {correctCount}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Correct</p>
        </div>
        <div className="px-4 py-4 text-center">
          <p className="text-2xl font-bold text-indigo-600 tabular-nums">
            {accuracyPercentage}%
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Accuracy</p>
        </div>
      </div>

      {/* Rankings */}
      <div className="px-6 py-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Final Rankings
        </h3>
        <ul className="space-y-2">
          {sorted.map((player, index) => (
            <li
              key={player.userId}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-50"
            >
              <span
                className={[
                  'flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border',
                  RANK_BADGES[index] ?? 'bg-gray-50 text-gray-500 border-gray-200',
                ].join(' ')}
              >
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {player.displayName}
                </p>
                <p className="text-xs text-gray-500">
                  {player.correctCount}/{player.totalAnswered} correct
                </p>
              </div>
              <span className="text-lg font-bold text-gray-900 tabular-nums">
                {player.score}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex gap-3">
        {onPlayAgain && (
          <Button onClick={onPlayAgain} variant="primary" size="md" fullWidth>
            Play Again
          </Button>
        )}
        <Link href="/dashboard" className="flex-1">
          <Button variant="secondary" size="md" fullWidth>
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

ResultsSummary.displayName = 'ResultsSummary';
