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
      '/hf-api': {
        target: 'https://router.huggingface.co/hf-inference',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hf-api/, ''),
        secure: false,
      },
      '/api/hf/instantid': {
        target: 'https://multimodalart-instantid-faceid-6m.hf.space',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/hf\/instantid/, ''),
        secure: false,
      },
    },
  },
})
