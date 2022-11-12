import { defineConfig } from 'astro/config'
import { base, siteConfig } from './site.config.mjs'

// https://astro.build/config
export default defineConfig({
  site: `${siteConfig.siteUrl}${base.production}`,
  base: import.meta.env.DEV ? base.development : base.production,
  server: ({ command }) => ({ port: command === 'dev' ? 3000 : 4000 }),
  vite: {
    build: {
      rollupOptions: {
        output: {
          // entry chunk assets それぞれの書き出し名の指定
          entryFileNames: `assets/js/main.js`,
          chunkFileNames: `assets/js/chunks/[name].js`,
          assetFileNames: `assets/[ext]/[name][extname]`,
        },
      },
    },
  },
})
