import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      },
      build: {
        target: 'es2015',
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info'],
          },
        },
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom'],
              'charts': ['recharts'],
              'ai': ['@google/genai'],
              'icons': ['lucide-react'],
            }
          }
        },
        chunkSizeWarningLimit: 600,
        cssCodeSplit: true,
        sourcemap: false,
      },
      optimizeDeps: {
        include: ['react', 'react-dom', 'lucide-react'],
        exclude: ['@google/genai'],
      }
    };
});
