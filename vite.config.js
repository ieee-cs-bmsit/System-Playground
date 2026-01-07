import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Tauri expects a fixed port
  server: {
    port: 1420,
    strictPort: true,
    host: '0.0.0.0',
  },

  // Environment variables
  envPrefix: ['VITE_', 'TAURI_'],

  // Build optimization
  build: {
    // Tauri uses Chromium on Windows and WebKit on macOS and Linux
    target: process.env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
    // Don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    // Produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
    // Output directory
    outDir: 'dist',
    // Clean output directory before build
    emptyOutDir: true,
  },

  // Prevent vite from clearing screen on dev server start (Tauri handles this)
  clearScreen: false,
})
