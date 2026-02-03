import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Code splitting agressivo
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'icons': ['lucide-react'],
        }
      }
    },
    // Minificação
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    // Performance
    reportCompressedSize: false,
    chunkSizeWarningLimit: 500,
  },
  server: {
    // Dev server
    hmr: {
      host: 'localhost',
      port: 5173,
    }
  }
})
