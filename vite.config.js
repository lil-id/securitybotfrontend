import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  preview: {
    port: 8085,
    host: true,
    strictPort: true,
  },
  server: {
    port: 8085,
    host: true,
    strictPort: true,
    origin: "http://0.0.0.0:8085",
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
