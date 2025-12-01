'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import {
  detectKonamiCode,
  detectSecretCombo,
  checkSpecialDate,
  unlockEasterEgg,
  getEasterEggs,
  type EasterEggType,
} from '@/lib/easterEggs';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';
import { ParticleEffect } from './ParticleEffect';
import { Confetti } from './Confetti';

interface EasterEggDetectorProps {
  children: React.ReactNode;
}

/**
 * EasterEggDetector Component
 * Detects and triggers easter eggs throughout the app
 */
export function EasterEggDetector({ children }: EasterEggDetectorProps) {
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const [tapCount, setTapCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [easterEggType, setEasterEggType] = useState<EasterEggType | null>(null);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { t, lang } = useI18n();
  const { triggerHaptic } = useHapticFeedback();

  // Konami Code detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newSequence = [...keySequence, e.key].slice(-10);
      setKeySequence(newSequence);

      if (detectKonamiCode(newSequence)) {
        unlockEasterEgg('konami-code', 'konami');
        setEasterEggType('konami');
        setShowCelebration(true);
        triggerHaptic('success');
        setTimeout(() => setShowCelebration(false), 3000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keySequence, triggerHaptic]);

  // Secret combo detection (tap logo)
  const handleLogoTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);

    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    tapTimeoutRef.current = setTimeout(() => {
      setTapCount(0);
    }, 2000);

    if (detectSecretCombo(newCount)) {
      unlockEasterEgg('secret-combo', 'secret-combo');
      setEasterEggType('secret-combo');
      setShowCelebration(true);
      triggerHaptic('success');
      setTimeout(() => setShowCelebration(false), 3000);
      setTapCount(0);
    }
  };

  // Special date detection
  useEffect(() => {
    const today = new Date();
    const specialDate = checkSpecialDate(today);
    if (specialDate) {
      const eggId = `special-date-${today.getMonth() + 1}-${today.getDate()}`;
      unlockEasterEgg(eggId, specialDate);
      setEasterEggType(specialDate);
      setShowCelebration(true);
      triggerHaptic('success');
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, []);

  return (
    <>
      {children}
      {showCelebration && (
        <>
          <ParticleEffect
            particleCount={100}
            colors={['#10b981', '#34d399', '#059669', '#fbbf24', '#f59e0b']}
            duration={3000}
            autoStart={true}
          />
          <Confetti active={showCelebration} particleCount={100} />
          <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border-2 border-brand animate-fade-in-scale">
              <div className="text-6xl mb-4 text-center animate-bounce">
                {easterEggType === 'konami' && '🎮'}
                {easterEggType === 'secret-combo' && '🔓'}
                {easterEggType === 'special-date' && '🎉'}
                {easterEggType === 'perfect-day' && '✨'}
                {easterEggType === 'achievement-milestone' && '🏆'}
              </div>
              <h3 className="text-2xl font-bold text-center text-gray-950 dark:text-white mb-2">
                {lang === 'tr' ? 'Sürpriz!' : 'Surprise!'}
              </h3>
              <p className="text-center text-gray-700 dark:text-gray-300">
                {lang === 'tr' ? 'Bir easter egg keşfettin!' : 'You discovered an easter egg!'}
              </p>
            </div>
          </div>
        </>
      )}
      {/* Logo tap detector - attach to logo element */}
      <div className="hidden" data-logo-tap-detector onClick={handleLogoTap} aria-hidden="true" />
    </>
  );
}
