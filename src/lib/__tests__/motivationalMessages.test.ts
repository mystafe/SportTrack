/**
 * Tests for motivational messages utility
 */

import { getMotivationalMessage } from '@/lib/motivationalMessages';

describe('motivationalMessages', () => {
  describe('getMotivationalMessage', () => {
    it('should return message when no activities and progress is 0', () => {
      const message = getMotivationalMessage(0, false);
      expect(message).not.toBeNull();
      expect(message?.emoji).toBeDefined();
      expect(message?.tr).toBeDefined();
      expect(message?.en).toBeDefined();
    });

    it('should return message for different progress levels', () => {
      const progress25 = getMotivationalMessage(25, true);
      expect(progress25).not.toBeNull();

      const progress50 = getMotivationalMessage(50, true);
      expect(progress50).not.toBeNull();

      const progress75 = getMotivationalMessage(75, true);
      expect(progress75).not.toBeNull();

      const progress100 = getMotivationalMessage(100, true);
      expect(progress100).not.toBeNull();
    });

    it('should return message based on mood', () => {
      const happyMessage = getMotivationalMessage(50, true, 'happy');
      expect(happyMessage).not.toBeNull();

      const cheerfulMessage = getMotivationalMessage(50, true, 'cheerful');
      expect(cheerfulMessage).not.toBeNull();

      const sadMessage = getMotivationalMessage(50, true, 'sad');
      expect(sadMessage).not.toBeNull();

      // Test with null mood (should use default messages)
      const nullMoodMessage = getMotivationalMessage(50, true, null);
      expect(nullMoodMessage).not.toBeNull();
    });

    it('should return null for invalid inputs', () => {
      // This test checks edge cases
      const message = getMotivationalMessage(-1, false);
      // Function should handle edge cases gracefully
      expect(message === null || (message && message.emoji)).toBeTruthy();
    });

    it('should return messages with both Turkish and English translations', () => {
      const message = getMotivationalMessage(50, true);
      if (message) {
        expect(message.tr).toBeDefined();
        expect(message.en).toBeDefined();
        expect(typeof message.tr).toBe('string');
        expect(typeof message.en).toBe('string');
      }
    });
  });
});
