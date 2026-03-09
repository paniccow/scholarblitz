'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface BuzzButtonProps {
  onBuzz: () => void;
  disabled?: boolean;
  buzzedPlayer?: string;
}

export const BuzzButton: React.FC<BuzzButtonProps> = ({
  onBuzz,
  disabled = false,
  buzzedPlayer,
}) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <AnimatePresence mode="wait">
        {buzzedPlayer ? (
          <motion.div
            key="buzzed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-24 h-24 rounded-full bg-yellow-100 border-4 border-yellow-400 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-8 h-8 text-yellow-600"
              >
                <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.784l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.784.785l.24 1.192a1 1 0 001.96 0l.239-1.192a1 1 0 01.784-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.784-.784l-.24-1.192zM5.92 7.17a1 1 0 00-1.838 0l-.704 1.68a1 1 0 01-.557.557l-1.68.704a1 1 0 000 1.838l1.68.704a1 1 0 01.557.557l.704 1.68a1 1 0 001.838 0l.704-1.68a1 1 0 01.557-.557l1.68-.704a1 1 0 000-1.838l-1.68-.704a1 1 0 01-.557-.557L5.92 7.17z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-yellow-700">
              {buzzedPlayer} buzzed in!
            </span>
          </motion.div>
        ) : (
          <motion.button
            key="buzz"
            type="button"
            onClick={onBuzz}
            disabled={disabled}
            initial={{ scale: 1 }}
            animate={
              disabled
                ? { scale: 1 }
                : {
                    scale: [1, 1.05, 1],
                    transition: {
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }
            }
            whileTap={disabled ? {} : { scale: 0.95 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={[
              'w-24 h-24 rounded-full flex items-center justify-center',
              'text-xl font-black tracking-wider text-white uppercase',
              'shadow-lg focus:outline-none focus:ring-4 focus:ring-red-400/50',
              'transition-colors duration-150',
              disabled
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 active:bg-red-700',
            ].join(' ')}
          >
            BUZZ
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

BuzzButton.displayName = 'BuzzButton';
