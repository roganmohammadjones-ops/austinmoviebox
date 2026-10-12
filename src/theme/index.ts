/**
 * MovieBox — Theme Index & Design Utilities
 */

import { colors, gradients, radius, spacing, typography } from './tokens';

export * from './tokens';

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  gradients,
} as const;

export type Theme = typeof theme;

/**
 * Format a numeric rating to a standard 1-decimal string (e.g. 8.6)
 */
export function formatRating(rating: number): string {
  if (isNaN(rating) || rating <= 0) return 'NR';
  return rating.toFixed(1);
}

/**
 * Format movie runtime from minutes to human-readable format (e.g. 166 -> "2h 46m")
 */
export function formatDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Return appropriate accent/badge color based on rating threshold
 */
export function getRatingColor(rating: number): string {
  if (rating >= 8.0) return colors.ratingGold;
  if (rating >= 7.0) return colors.primaryInk;
  return colors.secondaryInk;
}
