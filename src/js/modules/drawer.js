export const drawer = (toggleElement) => {
  const scrollable = typeof document.scrollingElement !== 'undefined' ? document.scrollingElement : document.documentElement
  const controlsId = toggleElement.getAttribute('aria-controls') // トグルの操作対象要素のid
  const drawerElement = document.getElementById(controlsId) // トグルの操作対象要素（ドロワーメニュー自体）

  // 背景スクロールロック
  const activateScrollLock = () => {
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
  const deactivateScrollLock = () => {
    document.documentElement.style.removeProperty('overflow')
    scrollable.style.removeProperty('padding-right')
    // document.documentElement.classList.remove(this.config.stateClassName)
  }

  // open判定
  const isOpenToggleDrawer = () => {
    const isOpenToggle = toggleElement.getAttribute('aria-expanded') === 'true' // トグルの状態がopenかcloseか
    const isOpenDrawer = drawerElement.getAttribute('aria-hidden') !== 'true' // ドロワーの状態がopenかcloseか
    return isOpenToggle && isOpenDrawer
  }

  // Open
  const setOpen = () => {
    toggleElement.setAttribute('aria-expanded', 'true') // aria-expanded=true => open
    drawerElement.setAttribute('aria-hidden', 'false') // aria-hidden=false => open
    toggleElement.setAttribute('aria-label', 'close')
    activateScrollLock()
    drawerElement.style.visibility = 'visible'
  }

  // Close
  const setClose = () => {
    toggleElement.setAttribute('aria-expanded', 'false') // aria-expanded=true => open
    drawerElement.setAttribute('aria-hidden', 'true') // aria-hidden=false => open
    toggleElement.setAttribute('aria-label', 'menu')
    drawerElement.style.visibility = 'hidden'
  }

  // open <-> close
  const toggle = () => {
    const isOpen = isOpenToggleDrawer()
    isOpen ? setClose() : setOpen()
  }

  // hundle
  const onToggle = () => {
    toggle()
  }

  // Escapeキーでドロワーを閉じる
  const onKeydownEsc = (event) => {
    if (!isOpenToggleDrawer() || event.key !== 'Escape') {
      return
    }
    event.preventDefault()
    setClose()
  }

  // スクロールロック解除はtransitionEventを監視
  const onTransitionendDrawer = (event) => {
    if (event.target !== drawerElement || event.propertyName !== 'visibility') {
      return
    }
    if (!isOpenToggleDrawer()) {
      deactivateScrollLock()
    }
  }

  setClose() // 初期化（閉じる）

  // clickイベント付与
  toggleElement.addEventListener('click', (event) => {
    event.preventDefault()
    onToggle()
  })

  window.addEventListener(
    'keydown',
    (event) => {
      onKeydownEsc(event)
    },
    false,
  )

  drawerElement.addEventListener(
    'transitionend',
    (event) => {
      onTransitionendDrawer(event)
    },
    false,
  )
}
