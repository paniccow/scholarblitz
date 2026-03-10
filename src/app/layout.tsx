import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'ScholarBlitz - Master Quiz Bowl',
  description:
    'Practice quiz bowl questions with progressive reveal, text-to-speech, and multiplayer support. Level up your academic competition skills.',
  metadataBase: new URL('https://scholarblitz.com'),
  openGraph: {
    title: 'ScholarBlitz - Master Quiz Bowl',
    description:
      'Practice quiz bowl questions with progressive reveal, text-to-speech, and multiplayer support. Level up your academic competition skills.',
    url: 'https://scholarblitz.com',
    siteName: 'ScholarBlitz',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScholarBlitz - Master Quiz Bowl',
    description:
      'Practice quiz bowl questions with progressive reveal, text-to-speech, and multiplayer support.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
