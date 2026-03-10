import { Capacitor } from '@capacitor/core';

export const isNativePlatform = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform();

export function initCapacitor() {
  console.log(`[Capacitor] Running on platform: ${platform}`);
  console.log(`[Capacitor] Is native: ${isNativePlatform}`);
}
