const detailsNodes = document.querySelectorAll('details')
if (detailsNodes.length) {
  (async () => {
    const { detailsUi } = await import('./modules/details.js')
    detailsUi(detailsNodes)
  })()
}
