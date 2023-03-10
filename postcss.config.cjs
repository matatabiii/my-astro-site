const config = {
  plugins: [
    require('postcss-import-ext-glob')({
      sort: 'desc',
    }),
    require('postcss-import'),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    require('postcss-mixins'),
    require('autoprefixer')({
      grid: true,
    }),
    require('postcss-custom-media'),
    require('postcss-sort-media-queries')({
      sort: 'mobile-first',
    }),
    // require('postcss-extract-media-query')({
    //   entry: path.join(__dirname, 'styles/main.scss'),
    //   status: true,
    //   extractAll: false,
    //   queries: {
    //     '(min-width: 1024px)': 'minLG',
    //     '(min-width: 768px)': 'minMD'
    //   },
    //   output: {
    //     path: path.join(__dirname, 'dist/assets/css'),
    //     name: '[name]-[query].css'
    //   }
    // })
  ],
}

module.exports = config
