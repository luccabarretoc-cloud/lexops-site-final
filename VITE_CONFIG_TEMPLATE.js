// vite.config.js ou vite.config.ts
// ADICIONE ISTO AO SEU ARQUIVO DE CONFIGURAÇÃO

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    // Compressão automática (gzip + brotli)
    compression({
      verbose: true,
      disable: false,
      threshold: 10240, // 10kb
      algorithm: 'gzip',
      ext: '.gz',
    }),
    compression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
  build: {
    // Otimizações de bundle
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        // Code splitting automático
        manualChunks: {
          'lucide-react': ['lucide-react'],
          'vendor': ['react', 'react-dom'],
        },
      },
    },
    // Tamanho de aviso reduzido
    chunkSizeWarningLimit: 500,
    // Remover sourcemaps em produção
    sourcemap: false,
    // Otimizar CSS
    cssCodeSplit: true,
  },
  server: {
    // Configurações de desenvolvimento
    preTransformRequests: ['lucide-react'],
  },
})

// ============================================
// SE ESTIVER USANDO CREATE-REACT-APP
// ============================================

// 1. Instale o package.json:
// npm install --save-dev compression-webpack-plugin terser-webpack-plugin

// 2. Use CRACO para override:
// npm install @craco/craco

// 3. Crie craco.config.js:
/*
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        })
      );

      webpackConfig.plugins.push(
        new CompressionPlugin({
          algorithm: 'gzip',
          test: /\.(js|css|html|svg)$/,
          threshold: 10240,
          minRatio: 0.8,
        })
      );

      return webpackConfig;
    },
  },
};
*/

// 4. Atualize package.json scripts:
/*
"scripts": {
  "start": "craco start",
  "build": "GENERATE_SOURCEMAP=false craco build",
  "test": "craco test"
}
*/
