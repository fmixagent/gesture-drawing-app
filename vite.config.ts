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
    esbuild: {
      pure: mode === 'production' ? ['console.log'] : [],
    },
    build: {
      outDir: resolve(__dirname, 'distPWA'),
      emptyOutDir: true,
    },
  };
});
