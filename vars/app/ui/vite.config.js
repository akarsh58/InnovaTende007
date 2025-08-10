import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  appType: 'spa',
  server: {
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:3000',
      '/tenders': 'http://localhost:3000',
      '/rfq': 'http://localhost:3000',
      '/admin': 'http://localhost:3000'
    }
  },
  preview: {
    port: 5174,
    proxy: {
      '/auth': 'http://localhost:3000',
      '/tenders': 'http://localhost:3000',
      '/rfq': 'http://localhost:3000',
      '/admin': 'http://localhost:3000'
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
