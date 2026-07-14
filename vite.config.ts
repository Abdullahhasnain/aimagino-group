import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the build works at any subpath (e.g. GitHub Pages
  // project sites at username.github.io/repo-name/) without hardcoding
  // the repo name.
  base: './',
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        // Split the heavy stable vendors from app code so they load in
        // parallel and stay browser-cached across app-code deploys.
        codeSplitting: {
          groups: [
            { name: 'three', test: /node_modules[\\/](three|@react-three|postprocessing|maath)/ },
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
          ],
        },
      },
    },
  },
})
