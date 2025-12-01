/**
 * Share Image Generator
 * Creates shareable images using Canvas API for stats, badges, and streaks
 */

export type ShareImageType = 'stats' | 'badge' | 'streak' | 'achievement';
export type ShareImageFormat = 'instagram-story' | 'twitter-card' | 'general';

export interface ShareImageData {
  type: ShareImageType;
  title: string;
  subtitle?: string;
  stats?: {
    label: string;
    value: string | number;
    icon?: string;
  }[];
  badge?: {
    icon: string;
    name: string;
    description: string;
  };
  streak?: {
    current: number;
    longest: number;
  };
  theme?: 'light' | 'dark';
}

const BRAND_COLOR = '#0ea5e9';
const BRAND_DARK = '#0284c7';
const BRAND_LIGHT = '#38bdf8';

/**
 * Generate a shareable image using Canvas API
 */
export async function generateShareImage(
  data: ShareImageData,
  format: ShareImageFormat = 'general'
): Promise<Blob> {
  const dimensions = getDimensions(format);
  const canvas = document.createElement('canvas');
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  const isDark = data.theme === 'dark';
  const bgColor = isDark ? '#000000' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#000000';
  const secondaryTextColor = isDark ? '#a1a1aa' : '#52525b';

  // Draw background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, dimensions.width, dimensions.height);

  // Draw gradient overlay
  const gradient = ctx.createLinearGradient(0, 0, dimensions.width, dimensions.height);
  gradient.addColorStop(0, `${BRAND_COLOR}20`);
  gradient.addColorStop(1, `${BRAND_DARK}10`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, dimensions.width, dimensions.height);

  // Draw content based on type
  switch (data.type) {
    case 'stats':
      drawStatsImage(ctx, data, dimensions, textColor, secondaryTextColor);
      break;
    case 'badge':
      drawBadgeImage(ctx, data, dimensions, textColor, secondaryTextColor);
      break;
    case 'streak':
      drawStreakImage(ctx, data, dimensions, textColor, secondaryTextColor);
      break;
    case 'achievement':
      drawAchievementImage(ctx, data, dimensions, textColor, secondaryTextColor);
      break;
  }

  // Draw logo/branding at bottom
  drawBranding(ctx, dimensions, secondaryTextColor);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to generate image blob'));
        }
      },
      'image/png',
      0.95
    );
  });
}

function getDimensions(format: ShareImageFormat): { width: number; height: number } {
  switch (format) {
    case 'instagram-story':
      return { width: 1080, height: 1920 }; // 9:16 aspect ratio
    case 'twitter-card':
      return { width: 1200, height: 675 }; // 16:9 aspect ratio
    case 'general':
    default:
      return { width: 1200, height: 630 }; // Standard share image
  }
}

function drawStatsImage(
  ctx: CanvasRenderingContext2D,
  data: ShareImageData,
  dimensions: { width: number; height: number },
  textColor: string,
  secondaryTextColor: string
) {
  const centerX = dimensions.width / 2;
  let y = 120;

  // Title
  ctx.font = 'bold 64px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.fillText(data.title, centerX, y);

  // Subtitle
  if (data.subtitle) {
    y += 80;
    ctx.font = '32px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = secondaryTextColor;
    ctx.fillText(data.subtitle, centerX, y);
  }

  // Stats grid
  if (data.stats && data.stats.length > 0) {
    y += 100;
    const statsPerRow = Math.min(data.stats.length, 3);
    const statWidth = dimensions.width / statsPerRow;
    const statHeight = 200;

    data.stats.forEach((stat, index) => {
      const x = (index % statsPerRow) * statWidth + statWidth / 2;
      const statY = y + Math.floor(index / statsPerRow) * (statHeight + 40);

      // Icon
      if (stat.icon) {
        ctx.font = '48px system-ui, -apple-system, sans-serif';
        ctx.fillText(stat.icon, x, statY);
      }

      // Value
      ctx.font = 'bold 56px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = BRAND_COLOR;
      ctx.fillText(String(stat.value), x, statY + 80);

      // Label
      ctx.font = '28px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = secondaryTextColor;
      ctx.fillText(stat.label, x, statY + 120);
    });
  }
}

function drawBadgeImage(
  ctx: CanvasRenderingContext2D,
  data: ShareImageData,
  dimensions: { width: number; height: number },
  textColor: string,
  secondaryTextColor: string
) {
  const centerX = dimensions.width / 2;
  let y = dimensions.height / 2 - 150;

  if (data.badge) {
    // Badge icon (large)
    ctx.font = '200px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(data.badge.icon, centerX, y);

    // Badge name
    y += 250;
    ctx.font = 'bold 56px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = textColor;
    ctx.fillText(data.badge.name, centerX, y);

    // Badge description
    y += 80;
    ctx.font = '32px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = secondaryTextColor;
    ctx.fillText(data.badge.description, centerX, y);
  }
}

function drawStreakImage(
  ctx: CanvasRenderingContext2D,
  data: ShareImageData,
  dimensions: { width: number; height: number },
  textColor: string,
  secondaryTextColor: string
) {
  const centerX = dimensions.width / 2;
  let y = dimensions.height / 2 - 100;

  // Title
  ctx.font = 'bold 64px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.fillText(data.title, centerX, y);

  if (data.streak) {
    // Current streak
    y += 150;
    ctx.font = 'bold 120px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = BRAND_COLOR;
    ctx.fillText(String(data.streak.current), centerX, y);

    y += 60;
    ctx.font = '36px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = secondaryTextColor;
    ctx.fillText('Current Streak', centerX, y);

    // Longest streak
    y += 120;
    ctx.font = 'bold 80px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = BRAND_DARK;
    ctx.fillText(String(data.streak.longest), centerX, y);

    y += 60;
    ctx.font = '32px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = secondaryTextColor;
    ctx.fillText('Longest Streak', centerX, y);
  }
}

function drawAchievementImage(
  ctx: CanvasRenderingContext2D,
  data: ShareImageData,
  dimensions: { width: number; height: number },
  textColor: string,
  secondaryTextColor: string
) {
  const centerX = dimensions.width / 2;
  let y = dimensions.height / 2 - 100;

  // Title
  ctx.font = 'bold 64px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.fillText(data.title, centerX, y);

  if (data.subtitle) {
    y += 100;
    ctx.font = '36px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = secondaryTextColor;
    ctx.fillText(data.subtitle, centerX, y);
  }
}

function drawBranding(
  ctx: CanvasRenderingContext2D,
  dimensions: { width: number; height: number },
  textColor: string
) {
  const y = dimensions.height - 40;
  ctx.font = '24px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.fillText('SportTrack', dimensions.width / 2, y);
}

/**
 * Check if Web Share API is available
 */
export function isWebShareAvailable(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator;
}

/**
 * Share using Web Share API with fallback to download
 */
export async function shareImage(
  blob: Blob,
  filename: string = 'sporttrack-share.png'
): Promise<void> {
  if (isWebShareAvailable() && navigator.canShare) {
    const file = new File([blob], filename, { type: 'image/png' });
    const data: ShareData = {
      files: [file],
      title: 'SportTrack Achievement',
      text: 'Check out my fitness progress!',
    };

    if (navigator.canShare(data)) {
      try {
        await navigator.share(data);
        return;
      } catch (error) {
        // User cancelled or error occurred, fallback to download
        console.debug('Web Share failed, falling back to download:', error);
      }
    }
  }

  // Fallback: Download the image
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
