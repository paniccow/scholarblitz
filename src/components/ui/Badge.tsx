'use client';

import React from 'react';

const colorStyles = {
  gray: 'bg-gray-100 text-gray-700',
  red: 'bg-red-100 text-red-700',
  orange: 'bg-orange-100 text-orange-700',
  amber: 'bg-amber-100 text-amber-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  lime: 'bg-lime-100 text-lime-700',
  green: 'bg-green-100 text-green-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  teal: 'bg-teal-100 text-teal-700',
  cyan: 'bg-cyan-100 text-cyan-700',
  sky: 'bg-sky-100 text-sky-700',
  blue: 'bg-blue-100 text-blue-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  violet: 'bg-violet-100 text-violet-700',
  purple: 'bg-purple-100 text-purple-700',
  fuchsia: 'bg-fuchsia-100 text-fuchsia-700',
  pink: 'bg-pink-100 text-pink-700',
  rose: 'bg-rose-100 text-rose-700',
} as const;

/** Map quiz categories to badge colors. */
export const categoryColors: Record<string, BadgeColor> = {
  math: 'indigo',
  science: 'emerald',
  history: 'amber',
  english: 'sky',
  geography: 'teal',
  art: 'fuchsia',
  music: 'violet',
  technology: 'cyan',
  literature: 'rose',
  general: 'gray',
};

export type BadgeColor = keyof typeof colorStyles;

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
} as const;

export type BadgeSize = keyof typeof sizeStyles;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
  size?: BadgeSize;
  /** Shortcut: pass a quiz category name and the color is resolved automatically. */
  category?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  color,
  size = 'md',
  category,
  className = '',
  children,
  ...props
}) => {
  const resolvedColor =
    color ?? (category ? categoryColors[category.toLowerCase()] : undefined) ?? 'gray';

  return (
    <span
      className={[
        'inline-flex items-center font-medium rounded-full whitespace-nowrap',
        colorStyles[resolvedColor],
        sizeStyles[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
