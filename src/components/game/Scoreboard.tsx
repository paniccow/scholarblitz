'use client';

import React, { useMemo } from 'react';

export interface ScoreboardPlayer {
  userId: string;
  displayName: string;
  score: number;
}

export interface ScoreboardProps {
  players: ScoreboardPlayer[];
  currentUserId: string;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  players,
  currentUserId,
}) => {
  const sorted = useMemo(
    () => [...players].sort((a, b) => b.score - a.score),
    [players],
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Scoreboard
        </h3>
      </div>
      <ul className="divide-y divide-gray-100">
        {sorted.map((player, index) => {
          const isCurrentUser = player.userId === currentUserId;
          return (
            <li
              key={player.userId}
              className={[
                'flex items-center gap-3 px-4 py-3',
                isCurrentUser ? 'bg-indigo-50' : '',
              ].join(' ')}
            >
              <span
                className={[
                  'flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold',
                  index === 0
                    ? 'bg-yellow-100 text-yellow-700'
                    : index === 1
                      ? 'bg-gray-200 text-gray-600'
                      : index === 2
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-500',
                ].join(' ')}
              >
                {index + 1}
              </span>
              <span
                className={[
                  'flex-1 text-sm truncate',
                  isCurrentUser ? 'font-semibold text-indigo-700' : 'text-gray-900',
                ].join(' ')}
              >
                {player.displayName}
                {isCurrentUser && (
                  <span className="ml-1 text-xs text-indigo-500">(you)</span>
                )}
              </span>
              <span className="text-sm font-bold tabular-nums text-gray-900">
                {player.score}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

Scoreboard.displayName = 'Scoreboard';
