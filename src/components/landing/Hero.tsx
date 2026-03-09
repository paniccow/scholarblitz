'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-indigo-50 overflow-hidden">
      {/* Subtle decorative gradient orb */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-100/40 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-32 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl"
        >
          Master Quiz Bowl.
          <br />
          <span className="text-indigo-600">One Question at a Time.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-gray-500 sm:text-xl"
        >
          Practice with thousands of tossup and bonus questions across every
          category. Train solo or compete with friends &mdash; and walk into your
          next tournament ready.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href="/signup"
            className="inline-flex h-12 items-center justify-center rounded-full bg-indigo-600 px-8 text-base font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Get Started Free
          </Link>

          <a
            href="#features"
            className="inline-flex h-12 items-center justify-center rounded-full border border-gray-300 bg-white px-8 text-base font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Learn More
          </a>
        </motion.div>
      </div>
    </section>
  );
}
