import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
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
