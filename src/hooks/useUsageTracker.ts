'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

const FREE_LIMIT_SECONDS = 900; // 15 minutes
const TRACK_INTERVAL_MS = 10_000; // 10 seconds

export function useUsageTracker(isPlaying = false) {
  const { profile } = useAuth();
  const [secondsUsed, setSecondsUsed] = useState(0);
  const [isPaywalled, setIsPaywalled] = useState(false);
  const [plan, setPlan] = useState<'free' | 'paid'>('free');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state from profile
  useEffect(() => {
    if (profile) {
      setSecondsUsed(profile.free_seconds_used);
      setPlan(profile.plan);
      setIsPaywalled(
        profile.plan === 'free' && profile.free_seconds_used >= FREE_LIMIT_SECONDS
      );
    }
  }, [profile]);

  const trackUsage = useCallback(async () => {
    try {
      const response = await fetch('/api/usage/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seconds: 10 }),
      });

      if (!response.ok) {
        console.error('Usage tracking failed:', response.statusText);
        return;
      }

      setSecondsUsed((prev) => {
        const updated = prev + 10;
        if (plan === 'free' && updated >= FREE_LIMIT_SECONDS) {
          setIsPaywalled(true);
        }
        return updated;
      });
    } catch (error) {
      console.error('Usage tracking error:', error);
    }
  }, [plan]);

  // Start tracking interval only while actively playing
  useEffect(() => {
    if (!isPlaying || isPaywalled || plan === 'paid') {
      return;
    }

    intervalRef.current = setInterval(trackUsage, TRACK_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, trackUsage, isPaywalled, plan]);

  return { secondsUsed, isPaywalled, plan };
}
