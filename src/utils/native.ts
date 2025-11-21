import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

/**
 * Native utilities for enhanced app experience
 */

const isNative = Capacitor.isNativePlatform();

/**
 * Haptic feedback utilities
 */
export const haptics = {
  // Light tap for selections and toggles
  light: async () => {
    if (!isNative) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {
      // Silently fail on unsupported devices
    }
  },

  // Medium tap for button presses
  medium: async () => {
    if (!isNative) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (e) {
      // Silently fail on unsupported devices
    }
  },

  // Heavy tap for important actions
  heavy: async () => {
    if (!isNative) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch (e) {
      // Silently fail on unsupported devices
    }
  },

  // Success notification
  success: async () => {
    if (!isNative) return;
    try {
      await Haptics.notification({ type: 'SUCCESS' });
    } catch (e) {
      // Silently fail on unsupported devices
    }
  },

  // Warning notification
  warning: async () => {
    if (!isNative) return;
    try {
      await Haptics.notification({ type: 'WARNING' });
    } catch (e) {
      // Silently fail on unsupported devices
    }
  },

  // Error notification
  error: async () => {
    if (!isNative) return;
    try {
      await Haptics.notification({ type: 'ERROR' });
    } catch (e) {
      // Silently fail on unsupported devices
    }
  },

  // Selection changed (like iOS picker)
  selection: async () => {
    if (!isNative) return;
    try {
      await Haptics.selectionStart();
      await Haptics.selectionChanged();
      await Haptics.selectionEnd();
    } catch (e) {
      // Silently fail on unsupported devices
    }
  }
};

/**
 * Check if running on native platform
 */
export const isNativePlatform = () => isNative;

/**
 * Get platform name
 */
export const getPlatform = () => Capacitor.getPlatform();

/**
 * Debounce haptic feedback to prevent excessive triggering
 */
let lastHapticTime = 0;
const HAPTIC_DEBOUNCE_MS = 50;

export const debouncedHaptic = (hapticFn: () => Promise<void>) => {
  const now = Date.now();
  if (now - lastHapticTime > HAPTIC_DEBOUNCE_MS) {
    lastHapticTime = now;
    hapticFn();
  }
};
