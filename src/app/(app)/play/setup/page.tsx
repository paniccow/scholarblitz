'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CategoryPicker } from '@/components/game/CategoryPicker';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DEFAULT_QUESTION_COUNT, DEFAULT_TIME_PER_QUESTION } from '@/lib/constants';

export default function GameSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultMode = searchParams.get('mode') === 'multiplayer' ? 'multiplayer' : 'solo';

  const [mode, setMode] = useState<'solo' | 'multiplayer'>(defaultMode);
  const [categories, setCategories] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(DEFAULT_QUESTION_COUNT);
  const [timePerQuestion, setTimePerQuestion] = useState(DEFAULT_TIME_PER_QUESTION);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For joining a multiplayer room
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleCreate = async () => {
    if (categories.length === 0) {
      setError('Please select at least one category.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/game/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          categories,
          questionCount,
          timePerQuestion,
          ttsEnabled,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create game');
      }

      const { sessionId, roomCode } = await res.json();

      if (mode === 'solo') {
        router.push(`/play/solo?session=${sessionId}`);
      } else {
        router.push(`/play/multiplayer/${roomCode}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) {
      setError('Please enter a room code.');
      return;
    }

    setError(null);
    setIsJoining(true);

    try {
      const res = await fetch('/api/game/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode: joinCode.trim().toUpperCase() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to join game');
      }

      router.push(`/play/multiplayer/${joinCode.trim().toUpperCase()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsJoining(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Game Setup</h1>
        <p className="mt-1 text-gray-500">Configure your practice session</p>
      </div>

      {/* Mode selector */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('solo')}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
            mode === 'solo'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Solo Practice
        </button>
        <button
          type="button"
          onClick={() => setMode('multiplayer')}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
            mode === 'multiplayer'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Multiplayer
        </button>
      </div>

      {/* Join existing room (multiplayer only) */}
      {mode === 'multiplayer' && (
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Join Existing Room
            </h2>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Enter room code"
              className="uppercase tracking-widest"
            />
            <Button loading={isJoining} onClick={handleJoin}>
              Join
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create new game */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            {mode === 'multiplayer' ? 'Or Create New Room' : 'Game Settings'}
          </h2>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Categories */}
          <CategoryPicker selected={categories} onChange={setCategories} />

          {/* Question count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Number of Questions
            </label>
            <div className="flex gap-2">
              {[10, 20, 30, 50].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setQuestionCount(n)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    questionCount === n
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Time per question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Time per Question (seconds)
            </label>
            <div className="flex gap-2">
              {[10, 15, 20, 30].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimePerQuestion(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timePerQuestion === t
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t}s
                </button>
              ))}
            </div>
          </div>

          {/* TTS toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Text-to-Speech</p>
              <p className="text-xs text-gray-500">Read questions aloud as they reveal</p>
            </div>
            <button
              type="button"
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                ttsEnabled ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  ttsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          {/* Submit */}
          <Button fullWidth loading={loading} onClick={handleCreate} size="lg">
            {mode === 'solo' ? 'Start Practice' : 'Create Room'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
