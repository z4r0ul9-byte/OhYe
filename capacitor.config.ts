import type { CapacitorConfig } from '@capacitor/cli'

/**
 * Konfigurasi Capacitor untuk wrap web build menjadi APK Android.
 * - webDir harus sama dengan outDir Vite ('dist').
 * - appId harus unik & stabil (reverse-domain).
 * - androidScheme 'https' agar API seperti geolocation/kamera bisa berjalan.
 */
const config: CapacitorConfig = {
  appId: 'com.appbuilder.generator',
  appName: 'App Builder',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  },
}

export default config
