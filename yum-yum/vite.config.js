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
  server: {
    proxy: {
      '/api/nutrition': {
        target: 'http://api.data.go.kr',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/api\/nutrition/, '/openapi/tn_pubr_public_nutri_info_api'),
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
});
