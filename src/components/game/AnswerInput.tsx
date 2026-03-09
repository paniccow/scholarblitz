'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface AnswerInputProps {
  onSubmit: (answer: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const AnswerInput: React.FC<AnswerInputProps> = ({
  onSubmit,
  disabled = false,
  placeholder = 'Type your answer...',
}) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = value.trim();
      if (!trimmed || disabled) return;
      onSubmit(trimmed);
      setValue('');
    },
    [value, disabled, onSubmit],
  );

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={[
          'flex-1 block w-full border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400',
          'px-4 py-2.5 text-base rounded-lg',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-indigo-500 focus:ring-indigo-500/20',
          'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
        ].join(' ')}
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className={[
          'inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-base font-medium',
          'bg-indigo-600 text-white shadow-sm',
          'hover:bg-indigo-700 transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        ].join(' ')}
      >
        Submit
      </button>
    </form>
  );
};

AnswerInput.displayName = 'AnswerInput';
