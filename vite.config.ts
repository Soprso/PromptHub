import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // base: "/PromptHub/", // Removed for custom domain (runs at root)

  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    proxy: {
      // Proxy /api/* to Netlify Dev (port 8888) during local development
      // Run: netlify dev  (instead of npm run dev) to test Netlify functions locally
      '/hf-api': {
        target: 'https://router.huggingface.co/hf-inference',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hf-api/, ''),
        secure: false,
      },
      '/api/head-swap': {
        target: 'http://localhost:8888',
        changeOrigin: true,
      },
      '/api/headswap-paid': {
        target: 'http://localhost:8888',
        changeOrigin: true,
      },
      '/api/create-order': {
        target: 'http://localhost:8888',
        changeOrigin: true,
      },
      '/api/check-headswap': {
        target: 'http://localhost:8888',
        changeOrigin: true,
      },
    },
  },
})
