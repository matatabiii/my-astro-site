import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://www.my-site.dev',
  vite: {
    build: {
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            console.log(assetInfo);
            if (assetInfo.name == 'global.scss') return 'css/customname.css'
            return 'css/[ext]-[name]-[hash][extname]'
          },
          compact: true
        },
      },
    },
  },
})
