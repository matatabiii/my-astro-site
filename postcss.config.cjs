const path = require('path')

const config = {
  plugins: [
    require('autoprefixer'),
    require('postcss-preset-env'),
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
