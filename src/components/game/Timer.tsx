'use client';

import React, { useMemo } from 'react';

export interface TimerProps {
  timeLeft: number;
  totalTime: number;
  size?: number;
}

export const Timer: React.FC<TimerProps> = ({
  timeLeft,
  totalTime,
  size = 80,
}) => {
  // totalTime === 0 means timer is disabled
  if (totalTime === 0) return null;

  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const fraction = totalTime > 0 ? timeLeft / totalTime : 0;
  const strokeDashoffset = circumference * (1 - fraction);

  const color = useMemo(() => {
    if (fraction > 0.5) return '#22c55e'; // green-500
    if (fraction > 0.25) return '#eab308'; // yellow-500
    return '#ef4444'; // red-500
  }, [fraction]);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={4}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-lg font-bold tabular-nums"
        style={{ color }}
      >
        {Math.max(0, Math.ceil(timeLeft))}
      </span>
    </div>
  );
};

Timer.displayName = 'Timer';
