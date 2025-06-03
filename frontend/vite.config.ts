import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: '0.0.0.0', // Важно для Docker
    port: 3000,
    strictPort: true,
    watch: {
      usePolling: true, // Для корректной работы hot reload в Docker
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Опционально: настройка для проксирования API в dev режиме
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://backend:3001',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, '')
  //     }
  //   }
  // }
})