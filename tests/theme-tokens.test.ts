import assert from 'node:assert/strict';
import test from 'node:test';
import { colors, radius, spacing, typography } from '../src/theme/tokens.ts';

test('Theme Tokens - Dark Cinematic Palette Constraints', () => {
  // Canvas background must be dark cinematic
  assert.equal(colors.cinemaCanvas.toLowerCase(), '#08090d', 'Canvas root background must be #08090D');
  assert.equal(colors.surfaceCard.toLowerCase(), '#141923', 'Card surface must be #141923');
  assert.equal(colors.surfaceElevated.toLowerCase(), '#202736', 'Surface elevated must be #202736');

  // Accent Cinema Red & Star Gold / Amber
  assert.equal(colors.cinemaRed.toLowerCase(), '#e50914', 'Primary accent must be Cinema Red #E50914');
  assert.equal(colors.cinemaAmber.toLowerCase(), '#f5c518', 'Secondary accent must be Star Amber #F5C518');

  // Primary text must be high contrast light
  assert.equal(colors.primaryInk.toLowerCase(), '#ffffff', 'Primary text ink must be #FFFFFF');
});

test('Theme Tokens - Grid Spacing Scale (4px Base)', () => {
  assert.equal(spacing.xs, 4);
  assert.equal(spacing.sm, 8);
  assert.equal(spacing.md, 12);
  assert.equal(spacing.lg, 16);
  assert.equal(spacing.xl, 20);
  assert.equal(spacing.xxl, 24);
  assert.equal(spacing.space3xl, 32);
});

test('Theme Tokens - Corner Radii', () => {
  assert.equal(radius.card, 16);
  assert.equal(radius.full, 9999);
});

test('Theme Tokens - Typography Hierarchy', () => {
  assert.equal(typography.display.fontSize, 36);
  assert.equal(typography.screenTitle.fontSize, 28);
  assert.equal(typography.sectionHeading.fontSize, 20);
  assert.equal(typography.cardTitle.fontSize, 16);
  assert.equal(typography.body.fontSize, 15);
});
