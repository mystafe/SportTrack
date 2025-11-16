'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Button } from '@/components/ui/Button';

interface LongPressMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  children: ReactNode;
}

export function LongPressMenu({ isOpen, position, onClose, children }: LongPressMenuProps) {
  const isMobile = useIsMobile();
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    // Adjust position to keep menu within viewport
    const menu = menuRef.current;
    const rect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = position.x;
    let y = position.y;

    // Adjust horizontal position
    if (x + rect.width > viewportWidth) {
      x = viewportWidth - rect.width - 10;
    }
    if (x < 10) {
      x = 10;
    }

    // Adjust vertical position
    if (y + rect.height > viewportHeight) {
      y = position.y - rect.height - 10;
    }
    if (y < 10) {
      y = 10;
    }

    setAdjustedPosition({ x, y });
  }, [isOpen, position]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Close on scroll
    const handleScroll = () => {
      onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menu = (
    <div
      ref={menuRef}
      className={`fixed z-[10002] ${isMobile ? 'min-w-[200px]' : 'min-w-[240px]'} bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden animate-scale-in`}
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
      }}
      role="menu"
      aria-label="Context menu"
    >
      {children}
    </div>
  );

  return typeof window !== 'undefined' ? createPortal(menu, document.body) : null;
}

interface LongPressMenuItemProps {
  onClick: () => void;
  icon?: string;
  label: string;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

export function LongPressMenuItem({
  onClick,
  icon,
  label,
  variant = 'default',
  disabled = false,
}: LongPressMenuItemProps) {
  const isMobile = useIsMobile();

  return (
    <Button
      type="button"
      variant={variant === 'danger' ? 'danger' : 'ghost'}
      size="sm"
      onClick={() => {
        if (!disabled) {
          onClick();
        }
      }}
      disabled={disabled}
      className={`w-full ${isMobile ? 'px-4 py-3' : 'px-5 py-3.5'} text-left justify-start h-auto touch-target`}
      role="menuitem"
    >
      {icon && <span className={`${isMobile ? 'text-lg' : 'text-xl'}`}>{icon}</span>}
      <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold`}>{label}</span>
    </Button>
  );
}
