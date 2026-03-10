'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export type RealtimeEvent =
  | 'buzz'
  | 'answer'
  | 'reveal'
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
  const channelRef = useRef<RealtimeChannel | null>(null);
  const pendingPresenceRef = useRef<PresenceState | null>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (!roomCode) return;

    const gameChannel = supabase.channel(`game:${roomCode}`, {
      config: {
        broadcast: { self: false },
        presence: { key: '' },
      },
    });

    const syncPlayers = () => {
      const presenceState = gameChannel.presenceState();
      const connectedPlayers: PresenceState[] = [];
      Object.values(presenceState).forEach((presences) => {
        (presences as unknown as PresenceState[]).forEach((presence) => {
          connectedPlayers.push(presence);
        });
      });
      setPlayers(connectedPlayers);
    };

    gameChannel.on('presence', { event: 'sync' }, syncPlayers);
    gameChannel.on('presence', { event: 'join' }, syncPlayers);
    gameChannel.on('presence', { event: 'leave' }, syncPlayers);

    const events: RealtimeEvent[] = [
      'buzz',
      'answer',
      'reveal',
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
        channelRef.current = gameChannel;
        setChannel(gameChannel);
        // If trackPresence was called before the channel was ready, track now
        if (pendingPresenceRef.current) {
          await gameChannel.track(pendingPresenceRef.current);
        }
      }
    });

    return () => {
      channelRef.current = null;
      supabase.removeChannel(gameChannel);
      setChannel(null);
      setPlayers([]);
    };
  }, [roomCode, supabase]);

  const broadcast = useCallback(
    async (event: RealtimeEvent, payload: Record<string, unknown>) => {
      if (!channelRef.current) return;
      await channelRef.current.send({
        type: 'broadcast',
        event,
        payload,
      });
    },
    []
  );

  // Always stable — stores presence in ref so it works even before channel is ready
  const trackPresence = useCallback(async (presenceData: PresenceState) => {
    pendingPresenceRef.current = presenceData;
    if (channelRef.current) {
      await channelRef.current.track(presenceData);
    }
  }, []);

  const onEvent = useCallback(
    (event: RealtimeEvent, handler: EventHandler) => {
      const existing = handlersRef.current.get(event) ?? [];
      handlersRef.current.set(event, [...existing, handler]);

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
