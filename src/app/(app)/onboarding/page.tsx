'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { CATEGORIES } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';

type Step = 'name' | 'categories' | 'complete';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const [step, setStep] = useState<Step>('name');
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameSubmit = () => {
    if (!displayName.trim()) {
      setError('Please enter a display name.');
      return;
    }
    setError(null);
    setStep('categories');
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleComplete = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        display_name: displayName.trim(),
        onboarding_complete: true,
      })
      .eq('id', user.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(['name', 'categories', 'complete'] as Step[]).map((s, i) => (
            <React.Fragment key={s}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s
                    ? 'bg-indigo-600 text-white'
                    : i < ['name', 'categories', 'complete'].indexOf(step)
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-gray-100 text-gray-400'
                }`}
              >
                {i + 1}
              </div>
              {i < 2 && <div className="w-12 h-0.5 bg-gray-200" />}
            </React.Fragment>
          ))}
        </div>

        <Card>
          <CardContent className="py-8">
            {step === 'name' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    What should we call you?
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    This will be shown on leaderboards
                  </p>
                </div>
                <Input
                  label="Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                  error={error ?? undefined}
                />
                <Button fullWidth onClick={handleNameSubmit}>
                  Continue
                </Button>
              </div>
            )}

            {step === 'categories' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Pick your favorite categories
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Select the topics you&apos;re most interested in (optional)
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedCategories.includes(cat)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" fullWidth onClick={() => setStep('name')}>
                    Back
                  </Button>
                  <Button fullWidth onClick={() => setStep('complete')}>
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 'complete' && (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    You&apos;re all set, {displayName}!
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Let&apos;s start practicing quiz bowl questions.
                  </p>
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <div className="flex gap-3">
                  <Button variant="secondary" fullWidth onClick={() => setStep('categories')}>
                    Back
                  </Button>
                  <Button fullWidth loading={loading} onClick={handleComplete}>
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
