import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: {
    port: 8000,
  },
  plugins: [
    tailwindcss(),
  ],
  build: {
    target: 'esnext'
  }
}); 