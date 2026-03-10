import { StatusBar as AwesomeStatusBar } from '@awesome-cordova-plugins/status-bar';
import { StatusBar as IonicNativeStatusBar } from '@ionic-native/status-bar';

export function initCordovaPlugins() {
  try {
    // Initialize Awesome Cordova Plugins StatusBar (web-safe, no-ops on web)
    console.log('[Cordova] Awesome StatusBar available:', !!AwesomeStatusBar);
    AwesomeStatusBar.styleDefault();
  } catch (err) {
    console.warn('[Cordova] Awesome StatusBar not available on web:', err);
  }

  try {
    // Initialize Ionic Native StatusBar (web-safe, no-ops on web)
    console.log('[Cordova] Ionic Native StatusBar available:', !!IonicNativeStatusBar);
  } catch (err) {
    console.warn('[Cordova] Ionic Native StatusBar not available on web:', err);
  }
}
