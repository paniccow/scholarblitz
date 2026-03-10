'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-white via-indigo-50/30 to-white overflow-hidden">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-100/40 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700 mb-6">
            4,300+ questions across 13 categories
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl"
        >
          Master Quiz Bowl.
          <br />
          <span className="text-indigo-600">One Question at a Time.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-gray-500 sm:text-xl"
        >
          Practice with thousands of real tossup questions from QB Reader and Open Trivia DB.
          Train solo with AI-powered question reading, or compete head-to-head with friends.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href="/signup"
            className="inline-flex h-12 items-center justify-center rounded-full bg-indigo-600 px-8 text-base font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Start Practicing Free
          </Link>

          <a
            href="#features"
            className="inline-flex h-12 items-center justify-center rounded-full border border-gray-300 bg-white px-8 text-base font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            See How It Works
          </a>
        </motion.div>

        {/* Demo preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-16 mx-auto max-w-3xl"
        >
          <div className="rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 bg-gray-50 border-b border-gray-200 px-4 py-2.5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-400 text-center">
                  scholarblitz.com/play/solo
                </div>
              </div>
            </div>

            {/* Fake game UI */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Solo Practice</p>
                  <p className="text-xs text-gray-500">Question 3 of 20</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">1x</span>
                  <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center">
                    <span className="text-sm font-bold text-green-600">12</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-5 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Science</span>
                  <span className="text-xs text-gray-400">3 / 20</span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed">
                  This element, with atomic number 79, has been prized for its luster and malleability since ancient times. It is represented by the symbol Au, derived from the Latin &quot;aurum.&quot; Name this precious metal.
                  <span className="inline-block w-0.5 h-4 ml-1 bg-indigo-500 animate-pulse align-text-bottom" />
                </p>
              </div>

              <div className="flex justify-center">
                <div className="inline-flex items-center justify-center px-8 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium">
                  BUZZ! (Space)
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
