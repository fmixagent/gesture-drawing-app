import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

// The source SVG is already a fully composed square (brand-dark background +
// centered mark), so the maskable/apple groups need no extra padding — just
// their default white margin swapped for the same background color.
export default defineConfig({
  preset: {
    ...minimal2023Preset,
    maskable: {
      ...minimal2023Preset.maskable,
      padding: 0,
      resizeOptions: { fit: 'contain', background: '#1b1b1f' },
    },
    apple: {
      ...minimal2023Preset.apple,
      padding: 0,
      resizeOptions: { fit: 'contain', background: '#1b1b1f' },
    },
  },
  images: ['src/renderer/public/favicon.svg'],
});
