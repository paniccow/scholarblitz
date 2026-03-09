'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const STEPS: Step[] = [
  {
    title: 'Welcome to ScholarBlitz',
    description:
      'The ultimate quiz bowl preparation tool. Practice with thousands of questions across every major category to sharpen your knowledge and reaction time.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-10 h-10 text-indigo-600"
      >
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
      </svg>
    ),
  },
  {
    title: 'Pick Your Topics',
    description:
      'Choose from categories like Science, History, Literature, Fine Arts, and more. Focus on your weak areas or practice everything for a well-rounded performance.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-10 h-10 text-indigo-600"
      >
        <path
          fillRule="evenodd"
          d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39.986 3.381.134a23.626 23.626 0 004.382-5.29c.51-1.01.13-2.25-.947-2.804l-9.58-4.79a3 3 0 00-2.573-.18L5.25 9.882V5.25zm1.5 4.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    title: 'Play Solo or Compete',
    description:
      'Practice at your own pace in solo mode, or create a multiplayer room to compete head-to-head with friends. Buzz in fast, answer correctly, and climb the scoreboard.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-10 h-10 text-indigo-600"
      >
        <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        <path
          fillRule="evenodd"
          d="M0 18a3 3 0 013-3h.75a.75.75 0 01.75.75 5.25 5.25 0 003.086 4.782A12.045 12.045 0 011.5 21.75 17.916 17.916 0 010 18zM24 18a3 3 0 00-3-3h-.75a.75.75 0 00-.75.75 5.25 5.25 0 01-3.086 4.782A12.045 12.045 0 0022.5 21.75c.507-.29.987-.614 1.437-.968A3 3 0 0024 18z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 200 : -200,
    opacity: 0,
  }),
};

export interface OnboardingFlowProps {
  onComplete?: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [completing, setCompleting] = useState(false);

  const isLast = currentStep === STEPS.length - 1;

  const goNext = useCallback(() => {
    if (isLast) {
      handleComplete();
      return;
    }
    setDirection(1);
    setCurrentStep((s) => s + 1);
  }, [isLast]);

  const goBack = useCallback(() => {
    setDirection(-1);
    setCurrentStep((s) => Math.max(0, s - 1));
  }, []);

  const handleComplete = useCallback(async () => {
    setCompleting(true);
    try {
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboarding_complete: true }),
      });
    } catch (err) {
      console.error('Failed to update onboarding status:', err);
    }
    setCompleting(false);
    onComplete?.();
  }, [onComplete]);

  const step = STEPS[currentStep];

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="px-8 pt-10 pb-8">
        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={[
                'w-2.5 h-2.5 rounded-full transition-colors duration-300',
                i === currentStep ? 'bg-indigo-600' : 'bg-gray-200',
              ].join(' ')}
            />
          ))}
        </div>

        {/* Animated content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="text-center"
          >
            <div className="mx-auto w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mb-6">
              {step.icon}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              {step.title}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-8 py-4 border-t border-gray-100 bg-gray-50/50">
        <div>
          {currentStep > 0 ? (
            <Button variant="ghost" size="sm" onClick={goBack}>
              Back
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleComplete}
              disabled={completing}
            >
              Skip
            </Button>
          )}
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={goNext}
          loading={completing}
        >
          {isLast ? 'Get Started' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

OnboardingFlow.displayName = 'OnboardingFlow';
