'use client';

import React from 'react';
import { GamePlayer } from '@/types/game';

export interface PlayerListProps {
  players: GamePlayer[];
  hostId: string;
}

export const PlayerList: React.FC<PlayerListProps> = ({ players, hostId }) => {
  return (
    <ul className="space-y-2">
      {players.map((player) => {
        const isHost = player.user_id === hostId;
        return (
          <li
            key={player.id}
            className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-gray-200"
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-indigo-600">
                  {(player.display_name ?? '?')[0]?.toUpperCase()}
                </span>
              </div>
              {isHost && (
                <span
                  className="absolute -top-1 -right-1 text-xs"
                  title="Host"
                  aria-label="Host"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 text-yellow-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </div>

            {/* Name */}
            <span className="flex-1 text-sm font-medium text-gray-900 truncate">
              {player.display_name ?? 'Anonymous'}
            </span>

            {/* Host badge */}
            {isHost && (
              <span className="text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">
                Host
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
};

PlayerList.displayName = 'PlayerList';
