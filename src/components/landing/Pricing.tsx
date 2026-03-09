'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started.',
    features: [
      '15 minutes of daily practice',
      'All question categories',
      'Solo practice mode',
      'Performance stats',
    ],
    cta: 'Get Started',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Unlimited',
    price: '$20',
    period: 'one-time',
    description: 'Lifetime access. No subscriptions.',
    features: [
      'Unlimited practice time',
      'All question categories',
      'Multiplayer battles',
      'Lifetime access',
    ],
    cta: 'Get Unlimited',
    href: '/signup',
    highlighted: true,
  },
];

export default function Pricing() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="bg-white py-28 sm:py-36">
      <div ref={ref} className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500">
            Start free. Upgrade once if you want more.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 sm:gap-6 lg:gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.12 * (i + 1),
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className={[
                'relative rounded-2xl border p-8 sm:p-10',
                plan.highlighted
                  ? 'border-indigo-600 shadow-lg shadow-indigo-100'
                  : 'border-gray-200',
              ].join(' ')}
            >
              {plan.highlighted && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              )}

              <h3 className="text-lg font-semibold text-gray-900">
                {plan.name}
              </h3>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">
                  {plan.price}
                </span>
                <span className="text-sm text-gray-500">/ {plan.period}</span>
              </div>

              <p className="mt-2 text-sm text-gray-500">{plan.description}</p>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-gray-600"
                  >
                    <svg
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-600"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={[
                  'mt-10 block w-full rounded-full py-3 text-center text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                  plan.highlighted
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
                ].join(' ')}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
