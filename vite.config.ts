import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: set "base" to your repo name when deploying to GitHub Pages.
// Example: if your repo is "myhub", set base: "/myhub/"
export default defineConfig({
  plugins: [react()],
  base: "" // e.g., "/student-dashboard/"
})
