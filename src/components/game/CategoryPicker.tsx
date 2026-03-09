'use client';

import React, { useCallback } from 'react';
import { CATEGORIES } from '@/lib/constants';

export interface CategoryPickerProps {
  selected: string[];
  onChange: (categories: string[]) => void;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  selected,
  onChange,
}) => {
  const toggleCategory = useCallback(
    (category: string) => {
      if (selected.includes(category)) {
        onChange(selected.filter((c) => c !== category));
      } else {
        onChange([...selected, category]);
      }
    },
    [selected, onChange],
  );

  const selectAll = useCallback(() => {
    onChange([...CATEGORIES]);
  }, [onChange]);

  const clearAll = useCallback(() => {
    onChange([]);
  }, [onChange]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">Categories</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Select All
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => {
          const isSelected = selected.includes(category);
          return (
            <button
              key={category}
              type="button"
              onClick={() => toggleCategory(category)}
              className={[
                'inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium',
                'transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500',
                isSelected
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ].join(' ')}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
};

CategoryPicker.displayName = 'CategoryPicker';
