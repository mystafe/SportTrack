import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 shadow-lg">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Sayfa Bulunamadı / Page Not Found
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir. / The page you're looking for
          doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base inline-block rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand font-semibold shadow-md hover:shadow-xl transition-all duration-300"
        >
          Ana Sayfaya Dön / Back to Home
        </Link>
      </div>
    </div>
  );
}
