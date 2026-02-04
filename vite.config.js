import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Code splitting agressivo - Vendor separado para melhor cache
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'icons': ['lucide-react'],
        },
        // Otimizar nomes para cache busting eficiente
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: '[ext]/[name].[hash].[ext]',
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
