'use client';

import { useState, useEffect, useRef } from 'react';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Button } from '@/components/ui/Button';

export interface TimerState {
  isRunning: boolean;
  elapsed: number; // seconds
  startTime: number | null; // timestamp
}

interface ActivityTimerProps {
  onDurationChange?: (duration: number) => void; // duration in seconds
  initialDuration?: number; // initial duration in seconds
}

export function ActivityTimer({ onDurationChange, initialDuration = 0 }: ActivityTimerProps) {
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const [state, setState] = useState<TimerState>({
    isRunning: false,
    elapsed: initialDuration,
    startTime: null,
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update elapsed time when running
  useEffect(() => {
    if (state.isRunning && state.startTime) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - state.startTime!) / 1000) + initialDuration;
        setState((prev) => ({ ...prev, elapsed }));
        onDurationChange?.(elapsed);
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.startTime, initialDuration, onDurationChange]);

  const handleStart = () => {
    if (!state.isRunning) {
      setState((prev) => ({
        isRunning: true,
        elapsed: prev.elapsed,
        startTime: Date.now() - prev.elapsed * 1000,
      }));
    }
  };

  const handleStop = () => {
    if (state.isRunning) {
      setState((prev) => ({
        isRunning: false,
        elapsed: prev.elapsed,
        startTime: null,
      }));
    }
  };

  const handleReset = () => {
    setState({
      isRunning: false,
      elapsed: 0,
      startTime: null,
    });
    onDurationChange?.(0);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="glass-effect card-3d space-y-3 p-4 rounded-lg border-2 border-white/20 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
          {t('timer.title')}
        </span>
        {state.elapsed > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label={t('timer.reset')}
          >
            {t('timer.reset')}
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div
          className={`flex-1 text-center font-mono ${isMobile ? 'text-2xl' : 'text-3xl'} font-bold ${
            state.isRunning ? 'text-brand' : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {formatTime(state.elapsed)}
        </div>

        <div className="flex items-center gap-2">
          {!state.isRunning ? (
            <Button
              type="button"
              variant="success"
              size="md"
              onClick={handleStart}
              className="min-h-[44px]"
              aria-label={t('timer.start')}
            >
              ▶️ {t('timer.start')}
            </Button>
          ) : (
            <Button
              type="button"
              variant="danger"
              size="md"
              onClick={handleStop}
              className="min-h-[44px]"
              aria-label={t('timer.stop')}
            >
              ⏸️ {t('timer.stop')}
            </Button>
          )}
        </div>
      </div>

      {state.elapsed > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {state.isRunning ? t('timer.running') : t('timer.paused')}
        </div>
      )}
    </div>
  );
}
