import { defineConfig } from 'astro/config';
import { base, siteConfig } from './site.config.mjs';

// https://astro.build/config
export default defineConfig({
  site: `${siteConfig.siteUrl}${base.production}`,
  base: import.meta.env.DEV ? base.development : base.production,
  server: ({ command }) => ({ port: command === 'dev' ? 3000 : 4000 }),
})
