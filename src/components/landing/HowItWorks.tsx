'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const steps = [
  {
    number: '1',
    title: 'Pick Your Topics',
    description: 'Choose from 13+ categories like Science, Literature, History, Fine Arts, and more.',
  },
  {
    number: '2',
    title: 'Play Solo or With Friends',
    description: 'Start a solo game or share a room code to compete with friends in real time.',
  },
  {
    number: '3',
    title: 'Get Competition Ready',
    description: 'Track your progress across categories and sharpen your weak spots before the big tournament.',
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="bg-gray-50 py-28 sm:py-36">
      <div ref={ref} className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How it works
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500">
            Three simple steps to sharpen your quiz bowl game.
          </p>
        </motion.div>

        <div className="relative mt-20">
          {/* Connecting line (desktop only) */}
          <div className="absolute top-10 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] hidden h-px bg-indigo-200 lg:block" />

          <div className="grid gap-16 lg:grid-cols-3 lg:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.15 * (i + 1),
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Vertical connecting line (mobile only) */}
                {i < steps.length - 1 && (
                  <div className="absolute top-[72px] left-1/2 h-[calc(100%+16px)] w-px -translate-x-1/2 bg-indigo-200 lg:hidden" />
                )}

                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white shadow-sm">
                  {step.number}
                </div>

                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xs text-base leading-7 text-gray-500">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
