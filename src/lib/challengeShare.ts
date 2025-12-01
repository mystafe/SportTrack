/**
 * Challenge Share Utility
 * Encode/decode challenges for sharing via URL
 */

import { Challenge } from './challenges';
import { generateChallengeId } from './challenges';

export interface ShareableChallenge {
  name: { tr: string; en: string };
  description: { tr: string; en: string };
  target: number;
  type: Challenge['type'];
  startDate?: string; // Optional - if not provided, use current date
  endDate?: string; // Optional - for custom challenges
  icon?: string;
  category?: Challenge['category'];
}

/**
 * Encode challenge to shareable format (removes user-specific data)
 */
export function encodeChallengeForShare(challenge: Challenge): string {
  const shareable: ShareableChallenge = {
    name: challenge.name,
    description: challenge.description,
    target: challenge.target,
    type: challenge.type,
    icon: challenge.icon,
    category: challenge.category,
  };

  // Only include dates if it's a custom challenge with specific dates
  if (challenge.type === 'custom' && challenge.endDate) {
    shareable.startDate = challenge.startDate;
    shareable.endDate = challenge.endDate;
  }

  // Encode to base64 URL-safe string
  const json = JSON.stringify(shareable);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64;
}

/**
 * Decode shareable challenge from base64 string
 */
export function decodeChallengeFromShare(encoded: string): ShareableChallenge | null {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    const shareable = JSON.parse(json) as ShareableChallenge;

    // Validate required fields
    if (!shareable.name || !shareable.description || !shareable.target || !shareable.type) {
      return null;
    }

    return shareable;
  } catch (error) {
    console.error('Failed to decode challenge:', error);
    return null;
  }
}

/**
 * Create a shareable challenge from shareable data
 */
export function createChallengeFromShare(shareable: ShareableChallenge): Challenge {
  const now = new Date();
  const startDate = shareable.startDate ? new Date(shareable.startDate) : now;

  return {
    id: generateChallengeId('shared'),
    type: shareable.type,
    name: shareable.name,
    description: shareable.description,
    target: shareable.target,
    startDate: startDate.toISOString(),
    endDate: shareable.endDate ? new Date(shareable.endDate).toISOString() : undefined,
    status: 'active',
    progress: 0,
    createdAt: now.toISOString(),
    icon: shareable.icon,
    category: shareable.category || 'custom',
  };
}

/**
 * Generate share URL for challenge
 */
export function generateChallengeShareUrl(challenge: Challenge, baseUrl?: string): string {
  const encoded = encodeChallengeForShare(challenge);
  const url = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${url}/challenges?import=${encoded}`;
}

/**
 * Extract challenge from URL query parameter
 */
export function extractChallengeFromUrl(): ShareableChallenge | null {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('import');

  if (!encoded) return null;

  return decodeChallengeFromShare(encoded);
}
