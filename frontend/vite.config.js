// vite.config.js
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to the backend
      '/api': {
        target: 'http://localhost:5000', // Replace with your backend server's address
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
