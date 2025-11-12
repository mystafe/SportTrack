import './globals.css';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Providers } from '@/components/Providers';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'SportTrack',
  description: 'Ön tanımlı aktivitelerle günlük 10.000 puan hedefini takip et'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning className="overflow-x-hidden">
      <body className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-950 overflow-x-hidden" suppressHydrationWarning>
        <Providers>
          <Header />
          <main className="container py-4 sm:py-6">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}


