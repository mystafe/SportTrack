import './globals.css';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Providers } from '@/components/Providers';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'SportTrack',
  description: 'Ön tanımlı aktivitelerle günlük 10.000 puan hedefini takip et',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SportTrack',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0ea5e9',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning className="overflow-x-hidden h-full">
      <body className="min-h-screen h-full bg-white dark:bg-gray-950 overflow-x-hidden safe-top safe-bottom" suppressHydrationWarning>
        <Providers>
          <Header />
          <main className="container py-4 sm:py-6">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}


