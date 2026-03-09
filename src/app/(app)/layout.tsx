'use client';

import React from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { Navbar } from '@/components/layout/Navbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}
