import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';
import { studioAddress, studioStructuredData } from './src/data/studioLocation.ts';

// Apply the production rules to Vite preview. This file has one global Pages rule.
const previewHeaders = Object.fromEntries(
  fs.readFileSync(new URL('./public/_headers', import.meta.url), 'utf8')
    .trim().split(/\r?\n/).slice(1).map(line => {
      const separator = line.indexOf(':');
      return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
    }),
);

export default defineConfig(() => {
  return {
    base: process.env.GITHUB_PAGES === 'true' ? '/aureabylnsite/' : '/',
    envPrefix: [],
    plugins: [
      {
        name: 'studio-location-metadata',
        transformIndexHtml: () => [
          { tag: 'meta', attrs: { name: 'description', content: `ÁURA BY LN — Studio Beauty. ${studioAddress}.` }, injectTo: 'head' },
          { tag: 'script', attrs: { type: 'application/ld+json' }, children: JSON.stringify(studioStructuredData).replace(/</g, '\\u003c'), injectTo: 'head' },
        ],
      },
      react(),
      tailwindcss(),
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const srcAssets = path.resolve(__dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {
            recursive: true,
            force: true,
            filter: (file) => fs.statSync(file).isDirectory() || /\.(?:avif|jpe?g|png|webp)$/i.test(file),
          });
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    preview: { headers: previewHeaders },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
