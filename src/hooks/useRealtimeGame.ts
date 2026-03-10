'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { GamePlayer } from '@/types/game';

export type RealtimeEvent =
  | 'buzz'
  | 'answer'
  | 'next'
  | 'game_start'
  | 'game_end';

interface PresenceState {
  userId: string;
  displayName: string;
  isHost: boolean;
  joinedAt: string;
}

type EventHandler = (payload: Record<string, unknown>) => void;

export function useRealtimeGame(roomCode: string) {
  const [players, setPlayers] = useState<PresenceState[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const handlersRef = useRef<Map<RealtimeEvent, EventHandler[]>>(new Map());
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (!roomCode) return;

    const gameChannel = supabase.channel(`game:${roomCode}`, {
      config: {
        broadcast: { self: true },
        presence: { key: '' },
      },
    });

    // Handle presence sync
    gameChannel.on('presence', { event: 'sync' }, () => {
      const presenceState = gameChannel.presenceState();
      const connectedPlayers: PresenceState[] = [];

      Object.values(presenceState).forEach((presences) => {
        (presences as unknown as PresenceState[]).forEach((presence) => {
          connectedPlayers.push(presence);
        });
      });

      setPlayers(connectedPlayers);
    });

    // Handle broadcast events
    const events: RealtimeEvent[] = [
      'buzz',
      'answer',
      'next',
      'game_start',
      'game_end',
    ];

    events.forEach((event) => {
      gameChannel.on('broadcast', { event }, ({ payload }) => {
        const handlers = handlersRef.current.get(event);
        if (handlers) {
          handlers.forEach((handler) => handler(payload));
        }
      });
    });

    gameChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        setChannel(gameChannel);
      }
    });

    return () => {
      supabase.removeChannel(gameChannel);
      setChannel(null);
      setPlayers([]);
    };
  }, [roomCode, supabase]);

  const broadcast = useCallback(
    async (event: RealtimeEvent, payload: Record<string, unknown>) => {
      if (!channel) return;
      await channel.send({
        type: 'broadcast',
        event,
        payload,
      });
    },
    [channel]
  );

  const trackPresence = useCallback(
    async (presenceData: PresenceState) => {
      if (!channel) return;
      await channel.track(presenceData);
    },
    [channel]
  );

  const onEvent = useCallback(
    (event: RealtimeEvent, handler: EventHandler) => {
      const existing = handlersRef.current.get(event) ?? [];
      handlersRef.current.set(event, [...existing, handler]);

      // Return unsubscribe function
      return () => {
        const current = handlersRef.current.get(event) ?? [];
        handlersRef.current.set(
          event,
          current.filter((h) => h !== handler)
        );
      };
    },
    []
  );

  return {
    players,
    broadcast,
    trackPresence,
    onEvent,
    channel,
  };
}
