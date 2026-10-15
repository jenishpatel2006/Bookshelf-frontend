import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' so the build also works on github pages under /repo-name/
export default defineConfig({
  base: './',
  plugins: [react()],
})
