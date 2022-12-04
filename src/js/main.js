import { drawer } from './modules/drawer.js'

const detailsNodes = document.querySelectorAll('details')
if (detailsNodes.length) {
  ;(async () => {
    const { detailsUi } = await import('./modules/details.js')
    detailsUi(detailsNodes)
  })()
}

const cloneTarget = document.getElementById('global-menu')
const cloneTargetNode = cloneTarget.cloneNode(true)
const cloneTtraceElement = document.createElement('div') // 元の場所に戻すための要素
cloneTtraceElement.id = 'clone-trace'

/* ドロワーのラッパー作成 */
if (!document.getElementById('global-menu-drawer')) {
  const drawerElement = document.createElement('div')
  drawerElement.id = 'global-menu-drawer'
  drawerElement.classList.add('c-drawer')
  drawerElement.setAttribute('aria-hidden', 'true')
  drawerElement.insertAdjacentHTML(
    'beforeend',
    `
  <div class="c-drawer__scrollarea">
    <div id="global-menu-drawer-container" class="c-drawer__container"></div>
  </div>
`,
  )
  drawerElement.querySelector('#global-menu-drawer-container').insertAdjacentElement('beforeend', cloneTargetNode)

  const toggleElement = document.getElementById('menu-toggle')

  const mql = window.matchMedia('(min-width: 1023px)')
  const handleMql = (mql) => {
    if (mql.matches && cloneTtraceElement) {
      /* デスクトップ */
      cloneTtraceElement.insertAdjacentElement('afterend', cloneTargetNode)
      cloneTtraceElement.remove()
      drawerElement.remove()
    } else if (!cloneTtraceElement) {
      /* その他 */
      toggleElement.insertAdjacentElement('afterend', drawerElement)
      cloneTarget.insertAdjacentElement('afterend', cloneTtraceElement)
      cloneTarget.remove()
    }
  }
  handleMql(mql)
  mql.addEventListener('change', handleMql)
}

// const toggleElement = document.getElementById('menu-toggle')
// if (toggleElement) {
//   drawer(toggleElement)
// }

// cloneTargetNode.remove()
// const drawerContainer = document.getElementById('global-menu-drawer-container')
// drawerContainer.insertAdjacentElement('beforeend', cloneNode)
// console.log(cloneNode)
