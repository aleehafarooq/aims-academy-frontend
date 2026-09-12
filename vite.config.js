import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Exposes Vite on your local network
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000', // Redirects frontend API calls to backend port 5000
        changeOrigin: true,
        secure: false,
      },
    },
  },
})