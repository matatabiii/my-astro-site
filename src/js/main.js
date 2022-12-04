import { createDrawer } from './modules/drawer.js'

const cloneTarget = document.getElementById('global-menu')
/* ドロワーのラッパー作成 */
if (cloneTarget !== null) {
  createDrawer(cloneTarget)
}

const detailsNodes = document.querySelectorAll('details')
if (detailsNodes.length) {
  ;(async () => {
    const { detailsUi } = await import('./modules/details.js')
    detailsUi(detailsNodes)
  })()
}


const hrefNodes = document.querySelector('a[href]:not(.js-ignore), [data-href]:not([data-href="#body"])')
if (hrefNodes) {
  ;(async () => {
    const { currentHref } = await import('./modules/currentHref.ts')
    currentHref().set()
  })()
}
