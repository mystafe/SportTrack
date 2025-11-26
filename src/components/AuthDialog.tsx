'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useToaster } from './Toaster';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export function AuthDialog({ open, onClose, initialMode = 'login' }: AuthDialogProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login, register, loginWithGoogle, resetPasswordEmail } = useAuth();
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const { showToast } = useToaster();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setMode(initialMode);
    }
  }, [open, initialMode]);

  if (!open || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        showToast(lang === 'tr' ? 'Giriş başarılı!' : 'Login successful!', 'success');
        onClose();
        // Redirect to home page after login
        router.push('/');
      } else if (mode === 'signup') {
        await register(email, password, displayName || undefined);
        showToast(lang === 'tr' ? 'Kayıt başarılı!' : 'Registration successful!', 'success');
        onClose();
        // Redirect to home page after signup
        router.push('/');
      } else if (mode === 'reset') {
        await resetPasswordEmail(email);
        showToast(
          lang === 'tr' ? 'Şifre sıfırlama e-postası gönderildi' : 'Password reset email sent',
          'success'
        );
        setMode('login');
      }
    } catch (error) {
      let errorMessage = '';
      if (error instanceof Error) {
        const errorCode = error.message;

        // Handle specific Firebase auth errors
        switch (errorCode) {
          case 'AUTH_USER_NOT_FOUND':
            errorMessage =
              lang === 'tr'
                ? 'Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı. Lütfen e-posta adresinizi kontrol edin veya kayıt olun.'
                : 'No user found with this email address. Please check your email or sign up.';
            break;
          case 'AUTH_WRONG_PASSWORD':
            errorMessage =
              lang === 'tr'
                ? 'Hatalı parola. Lütfen parolanızı kontrol edin.'
                : 'Wrong password. Please check your password.';
            break;
          case 'AUTH_INVALID_EMAIL':
            errorMessage =
              lang === 'tr'
                ? 'Geçersiz e-posta adresi. Lütfen geçerli bir e-posta adresi girin.'
                : 'Invalid email address. Please enter a valid email address.';
            break;
          case 'AUTH_EMAIL_ALREADY_IN_USE':
            errorMessage =
              lang === 'tr'
                ? 'Bu e-posta adresi zaten kullanılıyor. Lütfen giriş yapın veya farklı bir e-posta adresi kullanın.'
                : 'This email address is already in use. Please sign in or use a different email address.';
            break;
          case 'AUTH_WEAK_PASSWORD':
            errorMessage =
              lang === 'tr'
                ? 'Parola çok zayıf. Lütfen en az 6 karakterden oluşan güçlü bir parola seçin.'
                : 'Password is too weak. Please choose a strong password with at least 6 characters.';
            break;
          case 'AUTH_USER_DISABLED':
            errorMessage =
              lang === 'tr'
                ? 'Bu hesap devre dışı bırakılmış. Lütfen destek ekibi ile iletişime geçin.'
                : 'This account has been disabled. Please contact support.';
            break;
          case 'AUTH_TOO_MANY_REQUESTS':
            errorMessage =
              lang === 'tr'
                ? 'Çok fazla başarısız deneme. Lütfen bir süre sonra tekrar deneyin.'
                : 'Too many failed attempts. Please try again later.';
            break;
          case 'AUTH_NETWORK_ERROR':
            errorMessage =
              lang === 'tr'
                ? 'Ağ hatası. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.'
                : 'Network error. Please check your internet connection and try again.';
            break;
          case 'AUTH_OPERATION_NOT_ALLOWED':
            errorMessage =
              lang === 'tr'
                ? 'Bu işlem şu anda izin verilmiyor. Lütfen daha sonra tekrar deneyin.'
                : 'This operation is not allowed at the moment. Please try again later.';
            break;
          default:
            errorMessage =
              error.message || (lang === 'tr' ? 'Bir hata oluştu' : 'An error occurred');
        }
      } else {
        errorMessage = lang === 'tr' ? 'Bir hata oluştu' : 'An error occurred';
      }
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      showToast(lang === 'tr' ? 'Giriş başarılı!' : 'Login successful!', 'success');
      onClose();
      // Redirect to home page after Google login
      router.push('/');
    } catch (error) {
      let errorMessage = '';
      if (error instanceof Error) {
        if (
          error.message.includes('GOOGLE_SIGNIN_NOT_ENABLED') ||
          error.message.includes('CONFIGURATION_NOT_FOUND') ||
          error.message.includes('not enabled')
        ) {
          errorMessage =
            lang === 'tr'
              ? '❌ Google Sign-In etkinleştirilmemiş!\n\nFirebase Console → Authentication → Sign-in method → Google → Enable → Save'
              : '❌ Google Sign-In not enabled!\n\nFirebase Console → Authentication → Sign-in method → Google → Enable → Save';
        } else if (error.message.includes('Popup closed')) {
          errorMessage = lang === 'tr' ? 'Giriş penceresi kapatıldı' : 'Sign-in popup was closed';
        } else if (error.message.includes('Popup blocked')) {
          errorMessage =
            lang === 'tr'
              ? 'Giriş penceresi tarayıcı tarafından engellendi. Lütfen popup engelleyiciyi kapatın.'
              : 'Sign-in popup was blocked by browser. Please disable popup blocker.';
        } else {
          errorMessage = error.message;
        }
      } else {
        errorMessage = lang === 'tr' ? 'Google ile giriş başarısız' : 'Google login failed';
      }
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const dialog = (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`${isMobile ? 'w-full' : 'w-full max-w-md'} bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 p-6 my-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-950 dark:text-white`}
          >
            {mode === 'login'
              ? lang === 'tr'
                ? 'Giriş Yap'
                : 'Sign In'
              : mode === 'signup'
                ? lang === 'tr'
                  ? 'Kayıt Ol'
                  : 'Sign Up'
                : lang === 'tr'
                  ? 'Şifre Sıfırla'
                  : 'Reset Password'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
            aria-label={lang === 'tr' ? 'Kapat' : 'Close'}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <Input
              type="text"
              label={lang === 'tr' ? 'İsim' : 'Name'}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={lang === 'tr' ? 'İsim (opsiyonel)' : 'Name (optional)'}
              size={isMobile ? 'sm' : 'md'}
            />
          )}

          <Input
            type="email"
            label={lang === 'tr' ? 'E-posta' : 'Email'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder={lang === 'tr' ? 'ornek@email.com' : 'example@email.com'}
            size={isMobile ? 'sm' : 'md'}
            fullWidth
          />

          {mode !== 'reset' && (
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                label={lang === 'tr' ? 'Şifre' : 'Password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder={lang === 'tr' ? 'Şifre (min. 6 karakter)' : 'Password (min. 6 chars)'}
                size={isMobile ? 'sm' : 'md'}
                fullWidth
                iconRight={
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowPassword(!showPassword);
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand/20 rounded p-1"
                    aria-label={
                      showPassword
                        ? lang === 'tr'
                          ? 'Şifreyi gizle'
                          : 'Hide password'
                        : lang === 'tr'
                          ? 'Şifreyi göster'
                          : 'Show password'
                    }
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                }
              />
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size={isMobile ? 'sm' : 'md'}
            disabled={loading}
            loading={loading}
            fullWidth
          >
            {loading
              ? ''
              : mode === 'login'
                ? lang === 'tr'
                  ? 'Giriş Yap'
                  : 'Sign In'
                : mode === 'signup'
                  ? lang === 'tr'
                    ? 'Kayıt Ol'
                    : 'Sign Up'
                  : lang === 'tr'
                    ? 'Gönder'
                    : 'Send'}
          </Button>
        </form>

        {mode === 'login' && (
          <>
            <div className="my-4 flex items-center gap-2">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {lang === 'tr' ? 'veya' : 'or'}
              </span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
            </div>

            <Button
              variant="outline"
              size={isMobile ? 'sm' : 'md'}
              onClick={handleGoogleLogin}
              disabled={loading}
              icon="🔵"
              fullWidth
            >
              {lang === 'tr' ? 'Google ile Giriş' : 'Sign in with Google'}
            </Button>
          </>
        )}

        <div className="mt-4 text-center">
          {mode === 'login' ? (
            <>
              <button
                onClick={() => setMode('reset')}
                className="text-sm text-brand hover:text-brand-dark dark:text-brand-light"
              >
                {lang === 'tr' ? 'Şifremi unuttum' : 'Forgot password?'}
              </button>
              <div className="mt-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {lang === 'tr' ? 'Hesabın yok mu? ' : "Don't have an account? "}
                </span>
                <button
                  onClick={() => setMode('signup')}
                  className="text-sm text-brand hover:text-brand-dark dark:text-brand-light font-semibold"
                >
                  {lang === 'tr' ? 'Kayıt ol' : 'Sign up'}
                </button>
              </div>
            </>
          ) : mode === 'signup' ? (
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {lang === 'tr' ? 'Zaten hesabın var mı? ' : 'Already have an account? '}
              </span>
              <button
                onClick={() => setMode('login')}
                className="text-sm text-brand hover:text-brand-dark dark:text-brand-light font-semibold"
              >
                {lang === 'tr' ? 'Giriş yap' : 'Sign in'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setMode('login')}
              className="text-sm text-brand hover:text-brand-dark dark:text-brand-light"
            >
              {lang === 'tr' ? '← Geri dön' : '← Back'}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined' ? createPortal(dialog, document.body) : null;
}
