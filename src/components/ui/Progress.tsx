'use client';

import React from 'react';

const colorStyles = {
  indigo: 'bg-indigo-600',
  green: 'bg-green-500',
  red: 'bg-red-500',
  amber: 'bg-amber-500',
  blue: 'bg-blue-500',
  gray: 'bg-gray-500',
} as const;

export type ProgressColor = keyof typeof colorStyles;

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
} as const;

export type ProgressSize = keyof typeof sizeStyles;

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Value between 0 and 100. */
  value: number;
  color?: ProgressColor;
  size?: ProgressSize;
  /** Show the percentage label to the right of the bar. */
  showLabel?: boolean;
  /** Animate the fill width on mount / change. */
  animated?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  color = 'indigo',
  size = 'md',
  showLabel = false,
  animated = true,
  className = '',
  ...props
}) => {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className={['flex items-center gap-3', className].filter(Boolean).join(' ')}
      {...props}
    >
      <div
        className={[
          'flex-1 w-full bg-gray-200 rounded-full overflow-hidden',
          sizeStyles[size],
        ].join(' ')}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={[
            'h-full rounded-full',
            colorStyles[color],
            animated ? 'transition-all duration-500 ease-out' : '',
          ].join(' ')}
          style={{ width: `${clamped}%` }}
        />
      </div>

      {showLabel && (
        <span className="text-sm font-medium text-gray-600 tabular-nums min-w-[3ch] text-right">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
};

Progress.displayName = 'Progress';
