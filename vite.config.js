import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Memungkinkan akses via custom domain local dan IP jaringan
    port: 5173,
  },
})
