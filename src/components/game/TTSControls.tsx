'use client';

import React from 'react';

export interface TTSControlsProps {
  isReading: boolean;
  onPlay: () => void;
  onPause: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5] as const;

export const TTSControls: React.FC<TTSControlsProps> = ({
  isReading,
  onPlay,
  onPause,
  speed,
  onSpeedChange,
}) => {
  return (
    <div className="inline-flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200">
      {/* Play / Pause */}
      <button
        type="button"
        onClick={isReading ? onPause : onPlay}
        className="p-1 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        aria-label={isReading ? 'Pause' : 'Play'}
      >
        {isReading ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
        )}
      </button>

      {/* Speed selector */}
      <div className="flex items-center gap-0.5">
        {SPEED_OPTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSpeedChange(s)}
            className={[
              'px-1.5 py-0.5 rounded text-xs font-medium transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500/40',
              speed === s
                ? 'bg-indigo-600 text-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
            ].join(' ')}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
};

TTSControls.displayName = 'TTSControls';
