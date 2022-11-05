import { defineConfig } from 'astro/config';

const base = {
  development: '/', // 開発環境用のパス
  production: '/' // 本番環境用のパス
}

export const siteConfig = {
  siteName: 'サイト名',
  siteUrl: `https://example.com`,
  base: base,
  ogImage: 'og-image.jpg',
  msapplicationTileColor: '#ffffff',
  themeColor: '#ffffff',
  charset: 'UTF-8',
  locale: 'ja_JP',
  favicon: 'favicon.png',
  appleTouchIcon: 'apple-touch-icon.png',
}

// https://astro.build/config
export default defineConfig({
  site: `${siteConfig.siteUrl}${base.production}`,
  base: import.meta.env.DEV ? base.development : base.production,
  outDir: `.${base.production}`,
  server: ({ command }) => ({ port: command === 'dev' ? 3000 : 4000 }),
})
