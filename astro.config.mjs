import { defineConfig } from 'astro/config';

const base = {
  development: '/', // 開発環境用のパス
  production: '/example' // 本番環境用のパス
}

// https://astro.build/config
export default defineConfig({
  site: `https://example.com${base.production}`,
  base: import.meta.env.DEV ? base.development : base.production,
  outDir: `.${base.production}`,
  server: ({ command }) => ({ port: command === 'dev' ? 3000 : 4000 }),
})
