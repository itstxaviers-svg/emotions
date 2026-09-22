import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/emotions/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Тихий день — дневник чувств',
        short_name: 'Тихий день',
        description: 'Личный дневник чувств, состояний и оттенков дня',
        theme_color: '#fff3f2',
        background_color: '#fff3f2',
        display: 'standalone',
        start_url: '/emotions/',
        scope: '/emotions/',
        lang: 'ru',
        icons: [
          { src: '/emotions/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: '/emotions/icon-maskable.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' }
        ]
      },
      workbox: { navigateFallback: 'index.html', globPatterns: ['**/*.{js,css,html,svg}'] }
    })
  ]
});
