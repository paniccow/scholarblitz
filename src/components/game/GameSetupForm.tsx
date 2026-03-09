'use client';

import React, { useState, useCallback } from 'react';
import { CategoryPicker } from './CategoryPicker';
import { Button } from '@/components/ui/Button';
import {
  DEFAULT_QUESTION_COUNT,
  DEFAULT_TIME_PER_QUESTION,
  CATEGORIES,
} from '@/lib/constants';

export interface GameSettings {
  mode: 'solo' | 'multiplayer';
  categories: string[];
  questionCount: number;
  timePerQuestion: number;
  ttsEnabled: boolean;
}

export interface GameSetupFormProps {
  onStart: (settings: GameSettings) => void;
}

export const GameSetupForm: React.FC<GameSetupFormProps> = ({ onStart }) => {
  const [mode, setMode] = useState<'solo' | 'multiplayer'>('solo');
  const [categories, setCategories] = useState<string[]>([...CATEGORIES]);
  const [questionCount, setQuestionCount] = useState(DEFAULT_QUESTION_COUNT);
  const [timePerQuestion, setTimePerQuestion] = useState(DEFAULT_TIME_PER_QUESTION);
  const [ttsEnabled, setTtsEnabled] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (categories.length === 0) return;
      onStart({ mode, categories, questionCount, timePerQuestion, ttsEnabled });
    },
    [mode, categories, questionCount, timePerQuestion, ttsEnabled, onStart],
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mode selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Game Mode
        </label>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          {(['solo', 'multiplayer'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={[
                'flex-1 px-4 py-2.5 text-sm font-medium transition-colors',
                mode === m
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50',
              ].join(' ')}
            >
              {m === 'solo' ? 'Solo' : 'Multiplayer'}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <CategoryPicker selected={categories} onChange={setCategories} />

      {/* Question count */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            Questions
          </label>
          <span className="text-sm font-semibold text-indigo-600 tabular-nums">
            {questionCount}
          </span>
        </div>
        <input
          type="range"
          min={10}
          max={50}
          step={5}
          value={questionCount}
          onChange={(e) => setQuestionCount(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>10</span>
          <span>50</span>
        </div>
      </div>

      {/* Time per question */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            Time per Question
          </label>
          <span className="text-sm font-semibold text-indigo-600 tabular-nums">
            {timePerQuestion}s
          </span>
        </div>
        <input
          type="range"
          min={5}
          max={30}
          step={1}
          value={timePerQuestion}
          onChange={(e) => setTimePerQuestion(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>5s</span>
          <span>30s</span>
        </div>
      </div>

      {/* TTS toggle */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-gray-700">
            Text-to-Speech
          </span>
          <p className="text-xs text-gray-500 mt-0.5">
            Read questions aloud as they reveal
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={ttsEnabled}
          onClick={() => setTtsEnabled(!ttsEnabled)}
          className={[
            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
            'transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
            ttsEnabled ? 'bg-indigo-600' : 'bg-gray-200',
          ].join(' ')}
        >
          <span
            className={[
              'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transform ring-0',
              'transition-transform duration-200 ease-in-out',
              ttsEnabled ? 'translate-x-5' : 'translate-x-0',
            ].join(' ')}
          />
        </button>
      </div>

      {/* Submit */}
      <Button type="submit" size="lg" fullWidth disabled={categories.length === 0}>
        Start Game
      </Button>
    </form>
  );
};

GameSetupForm.displayName = 'GameSetupForm';
