import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: '/', // Base public path
  build: {
    outDir: 'dist', // Output directory for the build
  },
  plugins: [react()], // React plugin for Vite
});