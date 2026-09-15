import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    root: resolve(__dirname, 'src/renderer'),
    plugins: [
      react({
        include: '**/*.tsx',
      }),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'favicon.svg', 'apple-touch-icon-180x180.png'],
        manifest: {
          name: 'Gesture Drawing App',
          short_name: 'Gesture Drawing',
          description: 'Train gesture drawing with your own local folder of images.',
          theme_color: '#1b1b1f',
          background_color: '#1b1b1f',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: 'pwa-64x64.png',
              sizes: '64x64',
              type: 'image/png',
            },
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'maskable-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        // 2. Map the '@' symbol to the absolute path of your 'src' folder
        '@': resolve(__dirname, './src'),
        '@renderer': resolve(__dirname, './src/renderer/src'),
      },
    },
    esbuild: {
      pure: mode === 'production' ? ['console.log'] : [],
    },
    define: {
      'import.meta.env.WEB_VERSION': JSON.stringify(env.WEB_VERSION),
    },
    build: {
      outDir: resolve(__dirname, 'distPWA'),
      emptyOutDir: true,
    },
  };
});
