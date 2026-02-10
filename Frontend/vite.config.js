import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Output to dist/ folder
    outDir: 'dist',
    // Generate sourcemaps for production debugging (optional, disable for security)
    sourcemap: false,
    // Use esbuild for minification to avoid optional terser dependency
    minify: 'esbuild',
    // Set chunk size warning to 1MB
    chunkSizeWarningLimit: 1000,
    // Drop console/debugger during build using esbuild
    esbuild: {
      drop: ['console', 'debugger'],
    },
  },
  server: {
    // Dev server port
    port: 5173,
    // Allow external access (for VM testing)
    host: '0.0.0.0',
  },
})
