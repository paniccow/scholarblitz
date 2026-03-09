'use client';

import React, { useState, useCallback } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { PRICE_AMOUNT } from '@/lib/constants';

export interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BENEFITS = [
  'Unlimited practice sessions',
  'All question categories',
  'Multiplayer mode access',
  'Text-to-speech reading',
  'Performance analytics',
];

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm">
      <div className="text-center py-2">
        {/* Icon */}
        <div className="mx-auto w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-7 h-7 text-indigo-600"
          >
            <path
              fillRule="evenodd"
              d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Your free trial has ended
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Upgrade to keep practicing and improving your quiz bowl skills.
        </p>

        {/* Benefits */}
        <ul className="text-left space-y-2 mb-6">
          {BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2 text-sm text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 text-green-500 shrink-0"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              {benefit}
            </li>
          ))}
        </ul>

        {/* Price */}
        <div className="mb-4">
          <span className="text-3xl font-bold text-gray-900">${PRICE_AMOUNT}</span>
          <span className="text-sm text-gray-500 ml-1">one-time payment</span>
        </div>

        {/* CTA */}
        <Button
          onClick={handleUpgrade}
          loading={loading}
          size="lg"
          fullWidth
        >
          Unlock Unlimited Access
        </Button>
      </div>
    </Modal>
  );
};

PaywallModal.displayName = 'PaywallModal';
