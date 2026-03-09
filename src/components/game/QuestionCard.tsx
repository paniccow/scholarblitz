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
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  questionText,
  isRevealing,
  revealedWordCount,
  category,
  questionNumber,
  totalQuestions,
}) => {
  const words = useMemo(() => questionText.split(/\s+/), [questionText]);

  const displayedText = useMemo(() => {
    if (!isRevealing) return questionText;
    return words.slice(0, revealedWordCount).join(' ');
  }, [isRevealing, words, revealedWordCount, questionText]);

  const badgeColor = categoryColors[category.toLowerCase()] ?? 'gray';

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
        <Badge color={badgeColor} size="md">
          {category}
        </Badge>
        <span className="text-sm font-medium text-gray-500">
          {questionNumber} / {totalQuestions}
        </span>
      </div>

      {/* Question body */}
      <div className="px-6 py-8 min-h-[160px] flex items-start">
        <p className="text-lg leading-relaxed text-gray-900">
          {displayedText}
          {isRevealing && revealedWordCount < words.length && (
            <span className="inline-block w-0.5 h-5 ml-1 bg-indigo-500 animate-pulse align-text-bottom" />
          )}
        </p>
      </div>
    </div>
  );
};

QuestionCard.displayName = 'QuestionCard';
