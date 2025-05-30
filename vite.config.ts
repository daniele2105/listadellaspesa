import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Abilita tree shaking più aggressivo
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Rimuove console.log in produzione
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      }
    },
    // Ottimizza il chunking
    rollupOptions: {
      output: {
        manualChunks: {
          // Separa Firebase in un chunk dedicato
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/analytics'],
          // Separa React Router
          router: ['react-router-dom'],
          // Separa le icone Lucide
          icons: ['lucide-react'],
          // Chunk per le utilities
          utils: ['uuid']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['lucide-react']
  }
});
