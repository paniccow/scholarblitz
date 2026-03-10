'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { PRICE_AMOUNT } from '@/lib/constants';

interface CategoryStat {
  name: string;
  total: number;
  correct: number;
  accuracy: number;
}

interface StatsData {
  total: number;
  correct: number;
  accuracy: number;
  totalPoints: number;
  bestCategory: string | null;
  categories: CategoryStat[];
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    if (profile?.display_name) {
      setDisplayName(profile.display_name);
    }
  }, [profile]);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => { if (!data.error) setStats(data); })
      .catch(() => {});
  }, []);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setSaved(false);
    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ display_name: displayName.trim() })
      .eq('id', user.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }

    setSaving(false);
  };

  const handleUpgrade = async () => {
    setUpgradeLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setUpgradeLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-500">Manage your account</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Profile
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Email"
            value={user?.email ?? ''}
            disabled
            helperText="Email cannot be changed"
          />
          <Input
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter display name"
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          {saved && (
            <p className="text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">
              Profile updated successfully.
            </p>
          )}

          <Button loading={saving} onClick={handleSaveProfile}>
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Plan */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Plan
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Current Plan:{' '}
                <span
                  className={
                    profile.plan === 'paid'
                      ? 'text-green-600'
                      : 'text-gray-600'
                  }
                >
                  {profile.plan === 'paid' ? 'Premium' : 'Free'}
                </span>
              </p>
              {profile.plan === 'free' && (
                <p className="mt-0.5 text-xs text-gray-500">
                  {Math.round(profile.free_seconds_used / 60)} / 15 minutes used
                </p>
              )}
            </div>
            {profile.plan === 'paid' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                Active
              </span>
            )}
          </div>

          {profile.plan === 'free' && (
            <div className="bg-indigo-50 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-indigo-900">
                Upgrade to Premium
              </h3>
              <ul className="space-y-1.5 text-sm text-indigo-700">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited practice time
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All categories unlocked
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Multiplayer hosting
                </li>
              </ul>
              <Button
                fullWidth
                loading={upgradeLoading}
                onClick={handleUpgrade}
              >
                Upgrade for ${PRICE_AMOUNT}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Your Stats
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {!stats ? (
            <p className="text-sm text-gray-400">Loading stats...</p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Questions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{stats.correct}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Correct</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">{stats.accuracy}%</p>
                  <p className="text-xs text-gray-500 mt-0.5">Accuracy</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-600">{stats.totalPoints}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Total Points</p>
                </div>
              </div>

              {stats.bestCategory && (
                <div className="rounded-lg bg-indigo-50 px-4 py-3">
                  <p className="text-sm text-indigo-700">
                    Best category: <span className="font-semibold">{stats.bestCategory}</span>
                  </p>
                </div>
              )}

              {stats.categories.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">By Category</p>
                  <div className="space-y-2">
                    {stats.categories.slice(0, 8).map((cat) => (
                      <div key={cat.name} className="flex items-center gap-3">
                        <span className="text-sm text-gray-700 w-28 shrink-0 truncate">{cat.name}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-indigo-500 h-2 rounded-full"
                            style={{ width: `${cat.accuracy}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-12 text-right">{cat.accuracy}% ({cat.total})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {stats.total === 0 && (
                <p className="text-sm text-gray-400 text-center py-2">No games played yet. Start practicing to see your stats!</p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Account actions */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Account
          </h2>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-500">
            Member since{' '}
            {new Date(profile.created_at).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
