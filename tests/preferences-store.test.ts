import assert from 'node:assert/strict';
import test from 'node:test';
import { THEME_CONFIGS, REGION_CONFIGS, usePreferencesStore } from '../src/stores/preferences-store.ts';

test('Preferences Store - Default Configuration', () => {
  const state = usePreferencesStore.getState();
  assert.equal(state.themeMode, 'dark-cinema');
  assert.equal(state.region, 'US');
  assert.equal(state.autoplayTrailers, true);
  assert.equal(state.highQualityPosters, true);
  assert.equal(state.hapticsEnabled, true);
});

test('Preferences Store - Theme Configurations Validity', () => {
  assert.ok(THEME_CONFIGS['dark-cinema'], 'Dark Cinema config must exist');
  assert.ok(THEME_CONFIGS['oled'], 'OLED config must exist');
  assert.ok(THEME_CONFIGS['midnight-slate'], 'Midnight Slate config must exist');

  assert.equal(THEME_CONFIGS['dark-cinema'].previewAccent, '#F5C518');
  assert.equal(THEME_CONFIGS['oled'].previewAccent, '#E50914');
  assert.equal(THEME_CONFIGS['midnight-slate'].previewAccent, '#38BDF8');
});

test('Preferences Store - Region Configurations Validity', () => {
  assert.ok(REGION_CONFIGS['US'], 'US region config must exist');
  assert.ok(REGION_CONFIGS['GB'], 'GB region config must exist');
  assert.ok(REGION_CONFIGS['CA'], 'CA region config must exist');
  assert.ok(REGION_CONFIGS['AU'], 'AU region config must exist');
  assert.ok(REGION_CONFIGS['GLOBAL'], 'GLOBAL region config must exist');

  assert.equal(REGION_CONFIGS['US'].code, 'US');
  assert.equal(REGION_CONFIGS['GLOBAL'].code, 'GLOBAL');
});

test('Preferences Store - State Transitions', async () => {
  const store = usePreferencesStore.getState();

  await store.setThemeMode('oled');
  assert.equal(usePreferencesStore.getState().themeMode, 'oled');

  await store.setRegion('GB');
  assert.equal(usePreferencesStore.getState().region, 'GB');

  await store.setAutoplayTrailers(false);
  assert.equal(usePreferencesStore.getState().autoplayTrailers, false);

  await store.resetPreferences();
  assert.equal(usePreferencesStore.getState().themeMode, 'dark-cinema');
  assert.equal(usePreferencesStore.getState().region, 'US');
  assert.equal(usePreferencesStore.getState().autoplayTrailers, true);
});
