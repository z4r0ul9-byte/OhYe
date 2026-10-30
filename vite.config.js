import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' -> WAJIB untuk WebView Android (Capacitor),
// karena file HTML harus load asset relatif (./assets/...)
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
  },
  server: {
    host: true,
    port: 5173,
  },
})
