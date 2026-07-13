import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the build works at any subpath (e.g. GitHub Pages
  // project sites at username.github.io/repo-name/) without hardcoding
  // the repo name.
  base: './',
  plugins: [react()],
})
