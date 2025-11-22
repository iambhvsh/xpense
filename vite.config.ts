import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      deleteOriginFile: false,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom']
  },
  build: {
    target: 'es2020',
    minify: 'terser',
    cssMinify: true,
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: false,
        pure_funcs: []
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'db': ['dexie', 'dexie-react-hooks'],
          'charts': ['chart.js'],
          'state': ['zustand'],
          'capacitor': ['@capacitor/core', '@capacitor/app', '@capacitor/haptics', '@capacitor/status-bar', '@capacitor/keyboard', '@capacitor/splash-screen'],
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    },
    chunkSizeWarningLimit: 800,
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: false,
    assetsInlineLimit: 4096,
    modulePreload: {
      polyfill: false,
    },
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'lucide-react', 
      '@capacitor/core', 
      '@capacitor/app', 
      'dexie',
      'chart.js',
      'zustand',
      'es-toolkit/compat'
    ],
    exclude: ['@google/genai'],
    esbuildOptions: {
      target: 'es2020',
    },
  },
  worker: {
    format: 'es',
    plugins: () => [],
  },
  esbuild: {
    logOverride: { 
      'this-is-undefined-in-esm': 'silent',
    },
    legalComments: 'none',
    treeShaking: true,
  }
});
