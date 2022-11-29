import { drawer } from './modules/drawer.js'

const detailsNodes = document.querySelectorAll('details')
if (detailsNodes.length) {
  (async () => {
    const { detailsUi } = await import('./modules/details.js')
    detailsUi(detailsNodes)
  })()
}

const toggleElement = document.getElementById('menu-toggle')
if (toggleElement) {
  drawer(toggleElement)
}
