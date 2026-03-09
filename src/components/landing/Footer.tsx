'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center">
        <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
          ScholarBlitz
        </Link>

        <p className="text-sm text-gray-400">
          Made for Quiz Bowl competitors.
        </p>

        <p className="text-xs text-gray-300">
          &copy; {new Date().getFullYear()} ScholarBlitz. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
