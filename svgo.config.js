module.exports = {
  plugins: [
    {
      name: 'removeViewBox',
      params: true
    },
    {
      name: 'removeAttrs',
      params: {
        attrs: ['fill', 'id', 'data-name'],
      }
    },
  ],
}
