/*
<nav id="global-menu"></nav>
<MenuToggle id="menu-toggle" label="menu" controls="global-menu-drawer" />
*/
export const drawer = (toggleElement, drawerElementTarget) => {
  const scrollable = typeof document.scrollingElement !== 'undefined' ? document.scrollingElement : document.documentElement
  const controlsId = toggleElement.getAttribute('aria-controls') // トグルの操作対象要素のid
  const drawerElement = drawerElementTarget || document.getElementById(controlsId) // トグルの操作対象要素（ドロワーメニュー自体）

  const methods = {}

  // 背景スクロールロック
  methods.activateScrollLock = () => {
    const visibleWidth = scrollable.clientWidth
    document.documentElement.style.overflow = 'hidden'
    const hiddenWidth = scrollable.clientWidth
    const scrollbarWidth = hiddenWidth - visibleWidth
    // document.documentElement.classList.add(this.config.stateClassName)

    if (scrollbarWidth) {
      scrollable.style.paddingRight = scrollbarWidth + 'px'

      // if (this.calcScrollbarElm) {
      //   document.querySelectorAll(this.config.calcScrollbarElmsName).forEach((calcScrollbarElm) => {
      //     console.log(calcScrollbarElm)
      //     calcScrollbarElm.style.paddingRight = scrollbarWidth + 'px'
      //   })
      // }
    }
  }

  // 背景スクロールロック解除
  methods.deactivateScrollLock = () => {
    document.documentElement.style.removeProperty('overflow')
    scrollable.style.removeProperty('padding-right')
    // document.documentElement.classList.remove(this.config.stateClassName)
  }

  // open判定
  methods.isOpenToggleDrawer = (selfDrawerElement = drawerElement) => {
    const isOpenToggle = toggleElement.getAttribute('aria-expanded') === 'true' // トグルの状態がopenかcloseか
    const isOpenDrawer = selfDrawerElement && selfDrawerElement.getAttribute('aria-hidden') !== 'true' // ドロワーの状態がopenかcloseか
    return isOpenToggle && isOpenDrawer
  }

  // Open
  methods.setOpen = (selfDrawerElement = drawerElement) => {
    toggleElement.setAttribute('aria-expanded', 'true') // aria-expanded=true => open
    selfDrawerElement.setAttribute('aria-hidden', 'false') // aria-hidden=false => open
    toggleElement.setAttribute('aria-label', 'close')
    methods.activateScrollLock()
    selfDrawerElement.style.visibility = 'visible'
  }

  // Close
  methods.setClose = (selfDrawerElement = drawerElement) => {
    toggleElement.setAttribute('aria-expanded', 'false') // aria-expanded=true => open
    selfDrawerElement.setAttribute('aria-hidden', 'true') // aria-hidden=false => open
    toggleElement.setAttribute('aria-label', 'menu')
    selfDrawerElement.style.visibility = 'hidden'
  }

  // open <-> close
  methods.toggle = () => {
    const isOpen = methods.isOpenToggleDrawer()
    isOpen ? methods.setClose() : methods.setOpen()
  }

  // hundle
  methods.onToggle = (event) => {
    event.preventDefault()
    methods.toggle()
  }

  // Escapeキーでドロワーを閉じる
  methods.onKeydownEsc = (event) => {
    if (!methods.isOpenToggleDrawer() || event.key !== 'Escape') {
      return
    }
    event.preventDefault()
    methods.setClose()
  }

  // スクロールロック解除はtransitionEventを監視
  methods.onTransitionendDrawer = (event) => {
    if (event.target !== drawerElement || event.propertyName !== 'visibility') {
      return
    }
    if (!methods.isOpenToggleDrawer()) {
      methods.deactivateScrollLock()
    }
  }

  methods.addHandleEvent = (selfDrawerElement = drawerElement) => {
    toggleElement.addEventListener('click', methods.onToggle, false)
    window.addEventListener('keydown', methods.onKeydownEsc, false)
    selfDrawerElement.addEventListener('transitionend', methods.onTransitionendDrawer, false)
  }

  methods.removeHandleEvent = (selfDrawerElement = drawerElement) => {
    toggleElement.removeEventListener('click', methods.onToggle, false)
    window.removeEventListener('keydown', methods.onKeydownEsc, false)
    selfDrawerElement.removeEventListener('transitionend', methods.onTransitionendDrawer, false)
  }

  methods.setClose() // 初期化（閉じる）

  return methods
}

export const createDrawer = (cloneTarget, mqlConditions = '(min-width: 1023px)') => {
  cloneTarget.classList.add('js-drawer-root')

  if (!(!document.getElementById('global-menu-drawer') && cloneTarget && !document.documentElement.classList.contains('js-drawer-init'))) return false

  const cloneTargetNode = cloneTarget.cloneNode(true)
  cloneTargetNode.classList.remove('js-drawer-root')
  const cloneTtraceElement = document.createElement('div') // 元の場所に戻すための要素
  cloneTtraceElement.id = 'clone-trace'
  cloneTtraceElement.style.display = 'none'

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

  const mql = window.matchMedia(mqlConditions)
  const drawerMethods = drawer(toggleElement, drawerElement)

  const handleMql = (mql) => {
    const isCloneTrase = document.getElementById('clone-trace') !== null
    if (mql.matches) {
      drawerMethods.setClose(drawerElement)
      drawerMethods.removeHandleEvent(drawerElement)

      /* デスクトップ */
      /* 初回はHTMLに「cloneTargetNode」が存在するので初回判定のためにクラスで判断 */
      if (isCloneTrase) {
        cloneTtraceElement.insertAdjacentElement('afterend', cloneTarget)
        cloneTtraceElement.remove()
      }
      drawerElement.remove() // Drawer要素削除
    } else if (!isCloneTrase) {
      /* その他 */
      cloneTarget.insertAdjacentElement('afterend', cloneTtraceElement) // cloneTarget要素の削除準備
      cloneTarget.remove() // cloneTarget要素削除
      toggleElement.insertAdjacentElement('afterend', drawerElement) // Drawer要素設置

      drawerMethods.addHandleEvent(drawerElement)
    }
  }

  handleMql(mql)
  mql.addEventListener('change', handleMql)

  document.documentElement.classList.add('js-drawer-init')
  return {...{drawerElement},...drawerMethods}
}
