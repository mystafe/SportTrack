import './globals.css';
import Link from 'next/link';
import { ReactNode } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { I18nProvider } from '@/lib/i18n';
import { LanguageToggle } from '@/components/LanguageToggle';

export const metadata = {
  title: 'SportTrack',
  description: 'Ön tanımlı aktivitelerle günlük 10.000 puan hedefini takip et'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-950">
        <I18nProvider>
          <header className="border-b border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-950/60 backdrop-blur">
            <nav className="container flex items-center justify-between h-14">
              <Link href="/" className="font-semibold text-lg">
                SportTrack
              </Link>
              <div className="flex items-center gap-3 text-sm">
                <Link href="/activities" className="hover:text-brand">
                  Aktiviteler
                </Link>
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </nav>
          </header>
          <main className="container py-6">{children}</main>
          <footer className="container py-10 text-xs text-gray-500">
            © {new Date().getFullYear()} SportTrack · Mustafa Evleksiz
          </footer>
        </I18nProvider>
      </body>
    </html>
  );
}


