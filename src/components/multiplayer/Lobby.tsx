'use client';

import React from 'react';
import { GamePlayer } from '@/types/game';
import { RoomCodeDisplay } from './RoomCodeDisplay';
import { PlayerList } from './PlayerList';
import { Button } from '@/components/ui/Button';

export interface LobbyProps {
  roomCode: string;
  players: GamePlayer[];
  isHost: boolean;
  onStart: () => void;
  onLeave: () => void;
}

export const Lobby: React.FC<LobbyProps> = ({
  roomCode,
  players,
  isHost,
  onStart,
  onLeave,
}) => {
  const hostId = players.find((p) => p.is_host)?.user_id ?? '';

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Room code */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-6 text-center">
        <p className="text-sm font-medium text-gray-500 mb-3">Room Code</p>
        <RoomCodeDisplay code={roomCode} />
      </div>

      {/* Player list */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
          Players ({players.length})
        </h3>
        <PlayerList players={players} hostId={hostId} />
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {isHost ? (
          <Button
            onClick={onStart}
            size="lg"
            fullWidth
            disabled={players.length < 2}
          >
            Start Game
          </Button>
        ) : (
          <div className="text-center py-3">
            <p className="text-sm text-gray-500">Waiting for host to start...</p>
          </div>
        )}
        <Button onClick={onLeave} variant="ghost" size="md" fullWidth>
          Leave Room
        </Button>
      </div>
    </div>
  );
};

Lobby.displayName = 'Lobby';
