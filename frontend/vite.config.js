import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // מאפשר גישה מחוץ לlocalhost
    allowedHosts: ['popcornai'], // 👈 מוסיף את הדומיין שלך לרשימת המורשים
  },
  preview: {
    allowedHosts: ['popcornai'], // 👈 כדי שיעבוד גם במצב preview
  },
})