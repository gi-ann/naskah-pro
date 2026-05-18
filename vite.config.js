import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/naskah-pro/",  // <--- TAMBAHKAN BARIS INI DI SINI
})