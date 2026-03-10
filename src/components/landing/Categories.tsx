'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const categories = [
  { name: 'Science', count: '600+', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'History', count: '500+', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { name: 'Literature', count: '450+', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { name: 'Fine Arts', count: '300+', color: 'bg-pink-50 text-pink-700 border-pink-200' },
  { name: 'Geography', count: '250+', color: 'bg-green-50 text-green-700 border-green-200' },
  { name: 'Math', count: '200+', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { name: 'Mythology', count: '300+', color: 'bg-red-50 text-red-700 border-red-200' },
  { name: 'Philosophy', count: '250+', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { name: 'Religion', count: '200+', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  { name: 'Social Science', count: '250+', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { name: 'Pop Culture', count: '400+', color: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' },
  { name: 'Sports', count: '200+', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { name: 'General', count: 'All', color: 'bg-gray-50 text-gray-700 border-gray-200' },
];

const stats = [
  { value: '4,300+', label: 'Questions' },
  { value: '13', label: 'Categories' },
  { value: '3', label: 'Difficulty levels' },
  { value: '2', label: 'Game modes' },
];

export default function Categories() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="bg-gray-50 py-24 sm:py-32">
      <div ref={ref} className="mx-auto max-w-6xl px-6">
        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-indigo-600">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Every category you need
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500">
            From NAQT staples to niche topics, practice the categories that matter most for your next tournament.
          </p>
        </motion.div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.4,
                delay: 0.03 * (i + 1),
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 ${cat.color}`}
            >
              <span className="text-sm font-medium">{cat.name}</span>
              <span className="text-xs opacity-70">{cat.count}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
