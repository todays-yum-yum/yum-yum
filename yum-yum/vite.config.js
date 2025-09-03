import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // 추가
import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), svgr(), tailwindcss()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  test: {
    environment: 'jsdom',
    setupFiles: './config/setup.js',
    globals: true,
  },
});
