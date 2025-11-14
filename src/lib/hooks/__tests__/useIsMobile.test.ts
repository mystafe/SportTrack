/**
 * Tests for useIsMobile hook
 */

import { renderHook, act } from '@/test-utils';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

describe('useIsMobile', () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    // Reset matchMedia mock
    window.matchMedia = jest.fn();
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('should return boolean value', () => {
    window.matchMedia = jest.fn().mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    } as any);

    const { result } = renderHook(() => useIsMobile());

    expect(typeof result.current).toBe('boolean');
  });

  it('should detect mobile viewport', () => {
    window.matchMedia = jest.fn().mockReturnValue({
      matches: true, // Mobile breakpoint matches
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    } as any);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it('should detect desktop viewport', () => {
    window.matchMedia = jest.fn().mockReturnValue({
      matches: false, // Desktop (no mobile breakpoint)
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    } as any);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it('should update when viewport changes', () => {
    let changeCallback: ((e: MediaQueryListEvent) => void) | null = null;

    window.matchMedia = jest.fn().mockReturnValue({
      matches: false,
      addEventListener: jest.fn((event: string, callback: (e: MediaQueryListEvent) => void) => {
        if (event === 'change') {
          changeCallback = callback;
        }
      }),
      removeEventListener: jest.fn(),
    } as any);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    // Simulate viewport change to mobile
    act(() => {
      if (changeCallback) {
        changeCallback({ matches: true } as MediaQueryListEvent);
      }
    });

    expect(result.current).toBe(true);
  });
});
