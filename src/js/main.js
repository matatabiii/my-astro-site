import { createDrawer } from './modules/drawer.js'
import { SmoothScroll } from './modules/SmoothScroll'

const cloneTarget = document.getElementById('global-menu')
/* ドロワーのラッパー作成 */
const drawer = createDrawer(cloneTarget)

/*
 * スムーススクロール
 */
const smoothScrollSelector = 'a[href],[data-href]'
const smoothScroll = new SmoothScroll(smoothScrollSelector, {
  duration: 900,
  // offset: '#header',
  callback: (elem) => {
    drawer.setClose(drawer.drawerElement)
  }
})
smoothScroll.init()

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
