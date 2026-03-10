'use client';

import React, { useMemo } from 'react';
import { Badge, categoryColors } from '@/components/ui/Badge';

export interface QuestionCardProps {
  questionText: string;
  isRevealing: boolean;
  revealedWordCount: number;
  category: string;
  questionNumber: number;
  totalQuestions: number;
  hidden?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  questionText,
  isRevealing,
  revealedWordCount,
  category,
  questionNumber,
  totalQuestions,
  hidden = false,
}) => {
  const words = useMemo(() => questionText.split(/\s+/), [questionText]);
  const badgeColor = categoryColors[category.toLowerCase()] ?? 'gray';

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
        <Badge color={badgeColor} size="md">{category}</Badge>
        <span className="text-sm font-medium text-gray-500">
          {questionNumber} / {totalQuestions}
        </span>
      </div>

      {/* Question body */}
      <div className="px-6 py-8 min-h-[180px] flex items-start">
        {hidden ? (
          <div className="w-full space-y-3">
            <div className="h-5 bg-gray-200 rounded-full w-full animate-pulse" />
            <div className="h-5 bg-gray-200 rounded-full w-4/5 animate-pulse" />
            <div className="h-5 bg-gray-200 rounded-full w-3/5 animate-pulse" />
            <p className="text-sm text-gray-400 text-center pt-2">Text hidden — listening mode</p>
          </div>
        ) : (
          <p className="text-xl leading-relaxed font-medium text-black">
            {words.map((word, i) => {
              const visible = !isRevealing || i < revealedWordCount;
              return (
                <span
                  key={i}
                  style={{
                    transition: 'opacity 0.15s ease, transform 0.15s ease',
                    opacity: visible ? 1 : 0,
                    display: 'inline-block',
                    transform: visible ? 'translateY(0)' : 'translateY(4px)',
                    marginRight: '0.25em',
                  }}
                >
                  {word}
                </span>
              );
            })}
            {isRevealing && revealedWordCount < words.length && (
              <span className="inline-block w-0.5 h-6 ml-1 bg-indigo-500 animate-pulse align-text-bottom" />
            )}
          </p>
        )}
      </div>
    </div>
  );
};

QuestionCard.displayName = 'QuestionCard';
