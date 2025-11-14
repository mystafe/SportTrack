/**
 * Tests for formatDurationShort utility function
 */

import { formatDurationShort } from '@/lib/durationUtils';

describe('formatDurationShort', () => {
  it('should format seconds as MM:SS', () => {
    expect(formatDurationShort(0)).toBe('0:00');
    expect(formatDurationShort(30)).toBe('0:30');
    expect(formatDurationShort(60)).toBe('1:00');
    expect(formatDurationShort(90)).toBe('1:30');
    expect(formatDurationShort(125)).toBe('2:05');
  });

  it('should format hours as HH:MM:SS', () => {
    expect(formatDurationShort(3600)).toBe('1:00:00');
    expect(formatDurationShort(3661)).toBe('1:01:01');
    expect(formatDurationShort(7325)).toBe('2:02:05');
  });

  it('should handle large durations', () => {
    const largeDuration = 86400; // 24 hours
    const formatted = formatDurationShort(largeDuration);
    expect(formatted).toContain(':');
    expect(formatted.split(':').length).toBe(3); // HH:MM:SS format
  });

  it('should pad minutes and seconds with zeros', () => {
    expect(formatDurationShort(65)).toBe('1:05'); // 1 minute 5 seconds
    expect(formatDurationShort(3605)).toBe('1:00:05'); // 1 hour 5 seconds
  });

  it('should handle edge cases', () => {
    // Negative values may produce unexpected results, test that function doesn't crash
    const negativeResult = formatDurationShort(-1);
    expect(typeof negativeResult).toBe('string');

    // Very large values should still format
    const largeResult = formatDurationShort(Number.MAX_SAFE_INTEGER);
    expect(typeof largeResult).toBe('string');
    expect(largeResult).toBeTruthy();
  });
});
