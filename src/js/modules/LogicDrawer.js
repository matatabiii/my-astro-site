import { scrollable, triggerEvent } from './Utility'
import { LogicAccordion } from './LogicAccordion'

export class LogicDrawer {
  /**
   * 設定
   * @param {Object} userConfig 設定
      {
        triggerSelector: '[data-logic="drawer-trigger"]',
        drawerSelector: '[data-logic="drawer"]',
        scrollbleSelector: '[data-logic="drawer-scroll"]',
        closeTriggerSelector: '[data-logic="drawer-close"]',
        stateClassName: 'is-open-drawer'
      }
   */
  constructor (userConfig) {
    this.userConfig = userConfig
    this.onKeydownTabKeyFirstTabbable = this.onKeydownTabKeyFirstTabbable.bind(this)
    this.onKeydownTabKeyLastTabbable = this.onKeydownTabKeyLastTabbable.bind(this)
  }

  init () {
    this.isOpen = false
    this.FOCUSABLE_ELEMENTS = [
      'a[href]',
      'area[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[contenteditable]',
      '[tabindex]:not([tabindex^="-"])'
    ]
    this.config = {
      ...{
        triggerSelector: '[data-logic="drawer-trigger"]',
        drawerSelector: '[data-logic="drawer"]',
        scrollbleSelector: '[data-logic="drawer-scroll"]',
        drawerContainer: '[data-logic="drawer-container"]',
        closeTriggerSelector: '[data-logic="drawer-close"]',
        stateClassName: 'is-open-drawer',
        calcScrollbarElmsName: '.js-calc-scrollbar',
        tabbableSelector: 'a[href], button:not(:disabled)'
      },
      ...this.userConfig
    }

    this.stateChecker = document.createElement('input')
    this.stateChecker.setAttribute('type', 'checkbox')
    this.stateChecker.checked = this.isOpen

    this.triggerElem = document.querySelector(this.config.triggerSelector)
    this.drawerElem = document.querySelector(this.config.drawerSelector)
    this.drawerContainer = document.querySelector(this.config.drawerContainer)
    this.calcScrollbarElm = document.querySelector(this.config.calcScrollbarElmsName)
    this.triggerElem.setAttribute('aria-controls', this.drawerElem.getAttribute('id'))
    this.addTriggerEvent()

    // Drawer内に任意の要素を複製
    if (this.drawerContainer) {
      const targets = document.querySelectorAll('[data-drawer]')
      const list = this.returnDrawerInElemsArray(targets)
      this.appendDrawerInElems(this.drawerContainer, list)

      // 画像遅延読み込み
      if (this.drawerContainer.querySelector('img[data-src]:not(.js-lazyloaded)')) {
        this.drawerContainer.querySelectorAll('img[data-src]:not(.js-lazyloaded)').forEach((img) => {
          const dataSrc = img.dataset.src
          if (dataSrc) {
            const parent = img.parentNode
            if (parent?.nodeName === 'PICTURE') {
              // handles special <picture><source> case
              Array.from(parent.getElementsByTagName('source')).forEach((source) => {
                const dataSrcSet = source.dataset.srcset
                if (!img.hasAttribute('srcset') && dataSrcSet) {
                  source.srcset = dataSrcSet
                  source.removeAttribute('data-srcset')
                }
              })
            }
            if (img.dataset.src) {
              img.src = dataSrc
              img.removeAttribute('data-src')
            }
            if (!img.hasAttribute('srcset') && img.dataset.srcset) {
              img.srcset = img.dataset.srcset
              img.removeAttribute('data-srcset')
            }
          }
        })
      }
    }

    this.tabbableElems = this.drawerElem.querySelectorAll(this.config.tabbableSelector)
    this.lastTabbable = this.tabbableElems[this.tabbableElems.length - 1]
    this.firstTabbable = this.tabbableElems[0]

    // ステータスに応じて、クラスの切り替えなど
    this.stateChecker.addEventListener('change', () => this.change(), false)
    this.setChecked(false)
    this.drawerElem.addEventListener(
      'transitionend',
      (event) => {
        this.onTransitionendDrawer(event)
      },
      false
    )

    // if (this.isIOSVersion12Lower()) this.iOS12LowerPolyfill()

    window.addEventListener(
      'keydown',
      (event) => {
        this.onKeydownEsc(event)
      },
      false
    )

    // ブレークポイントに応じた状態の切り替え
    const breakPoint = '(min-width: 1024px)'
    const mql = window.matchMedia(breakPoint)

    const handleMql = (mql) => {
      if (mql.matches) {
        if (this.isOpen) {
          this.setChecked(false)
          this.deactivateScrollLock()
        }
      }
    }

    mql.onchange = handleMql
    handleMql(mql) // 初期実行

    const logicAccordionSelector = this.config.drawerSelector + ' .js-drawerInAccordion'
    if (document.querySelector(logicAccordionSelector)) {
      document.querySelectorAll(logicAccordionSelector).forEach((accordionElem) => {
        const Accordion = new LogicAccordion({
          accordionElem: accordionElem
        })
        if (!mql.matches) {
          Accordion.init()
        } else {
          Accordion.destroy()
        }
      })
    }
  }

  // Open/Closeのステータス管理
  setChecked (state) {
    this.isOpen = state
    this.stateChecker.checked = state
    triggerEvent('change', this.stateChecker)
  }

  // change trigger drawer
  change () {
    if (this.isOpen) {
      this.openDrawer()

      if (this.firstTabbable) {
        this.firstTabbable.addEventListener('keydown', this.onKeydownTabKeyFirstTabbable, false)
        this.lastTabbable.addEventListener('keydown', this.onKeydownTabKeyLastTabbable, false)
      }
    } else {
      this.closeDrawer()

      if (this.firstTabbable) {
        this.firstTabbable.removeEventListener('keydown', this.onKeydownTabKeyFirstTabbable, false)
        this.lastTabbable.removeEventListener('keydown', this.onKeydownTabKeyLastTabbable, false)
      }
    }
  }

  // changeState stateは真偽値
  changeAriaExpanded (state) {
    const value = state ? 'true' : 'false'
    this.drawerElem.setAttribute('aria-expanded', value)
    this.triggerElem.setAttribute('aria-expanded', value)
  }

  // 背景スクロールロック
  activateScrollLock () {
    const visibleWidth = scrollable.clientWidth
    document.documentElement.style.overflow = 'hidden'
    const hiddenWidth = scrollable.clientWidth
    const scrollbarWidth = hiddenWidth - visibleWidth
    document.documentElement.classList.add(this.config.stateClassName)

    if (scrollbarWidth) {
      scrollable.style.paddingRight = scrollbarWidth + 'px'

      if (this.calcScrollbarElm) {
        document.querySelectorAll(this.config.calcScrollbarElmsName).forEach((calcScrollbarElm) => {
          console.log(calcScrollbarElm)
          calcScrollbarElm.style.paddingRight = scrollbarWidth + 'px'
        })
      }
    }
  }

  // 背景スクロールロック解除
  deactivateScrollLock () {
    document.documentElement.style.removeProperty('overflow')
    document.documentElement.classList.remove(this.config.stateClassName)
    scrollable.style.removeProperty('padding-right')

    if (this.calcScrollbarElm) {
      this.calcScrollbarElm.style.removeProperty('padding-right')
      document.querySelectorAll(this.config.calcScrollbarElmsName).forEach((calcScrollbarElm) => {
        calcScrollbarElm.style.removeProperty('padding-right')
      })
    }
  }

  // open
  openDrawer () {
    this.activateScrollLock()
    this.changeAriaExpanded(true)
  }

  // close（スクロールロック解除はtransitionEventを監視）
  closeDrawer () {
    this.changeAriaExpanded(false)
  }

  // スクロールロック解除はtransitionEventを監視
  onTransitionendDrawer (event) {
    if (event.target !== this.drawerElem || event.propertyName !== 'visibility') {
      return
    }
    if (!this.isOpen) {
      this.deactivateScrollLock()
      this.triggerElem.focus()
    } else {
      if (this.firstTabbable) {
        this.firstTabbable.focus()
      }
    }
  }

  // トリガーにイベント付与
  addTriggerEvent () {
    this.triggerElem.addEventListener(
      'click',
      (e) => {
        e.preventDefault()

        if (!this.isOpen) {
          this.setChecked(true)
        } else {
          this.setChecked(false)
        }
      },
      false
    )

    if (document.querySelector(this.config.closeTriggerSelector)) {
      this.closeTriggerElems = document.querySelectorAll(this.config.closeTriggerSelector)

      Array.from(this.closeTriggerElems).forEach((closeTriggerElem) => {
        closeTriggerElem.addEventListener(
          'click',
          (e) => {
            if (this.isOpen) {
              this.setChecked(false)
            }
          },
          false
        )
      })
    }
  }

  // IOSバージョンが12以下か
  // isIOSVersion12Lower () {
  //   if (!ua.os.iOS) return false
  //   const version = window.navigator.userAgent.toLowerCase().match(/os (.+?) like/)[1]
  //   const v = parseFloat(version.replace('_', '.'))
  //   return v < 13
  // }

  // ios12以下のスクロールロック対策（CodeGrid参考）
  iOS12LowerPolyfill () {
    document.documentElement.classList.add('iOS12LowerPolyfill')
    const scrollableTarget = this.drawerElem.querySelector(this.config.scrollbleSelector)
    let touchY = null

    function onTouchStart (event) {
      if (event.targetTouches.length > 1) {
        return
      }
      touchY = event.targetTouches[0].clientY
    }

    function onTouchMove (event) {
      if (event.targetTouches.length > 1) {
        return
      }
      // touchstart時と現在の差分から、スクロール方向を得る
      // 正：上方向へスクロール
      // 負：下方向へスクロール
      const touchMoveDiff = event.targetTouches[0].clientY - touchY

      if (scrollableTarget.scrollTop === 0 && touchMoveDiff > 0) {
        event.preventDefault()
        return
      }

      if (targetTotallyScrolled(scrollableTarget) && touchMoveDiff < 0) {
        event.preventDefault()
      }
    }

    function targetTotallyScrolled (element) {
      return element.scrollHeight - element.scrollTop <= element.clientHeight
    }

    // function onTouchMoveBackdrop (event) {
    //   if (event.targetTouches.length > 1) {
    //     return
    //   }
    //   event.preventDefault()
    // }

    scrollableTarget.addEventListener('touchstart', onTouchStart, false)
    scrollableTarget.addEventListener('touchmove', onTouchMove, false)
    // backdrop.addEventListener('touchmove', onTouchMoveBackdrop, false)
  }

  // ドロワー内のフォーカス制御を行う
  onKeydownTabKeyFirstTabbable (event) {
    if (event.key !== 'Tab' || !event.shiftKey) {
      return
    }
    event.preventDefault()
    this.lastTabbable.focus()
  }

  // ドロワー内のフォーカス制御を行う
  onKeydownTabKeyLastTabbable (event) {
    if (event.key !== 'Tab' || event.shiftKey) {
      return
    }
    event.preventDefault()
    this.firstTabbable.focus()
  }

  // Escapeキーでドロワーを閉じる
  onKeydownEsc (event) {
    if (!this.isOpen || event.key !== 'Escape') {
      return
    }
    event.preventDefault()
    this.setChecked(false)
  }

  // スクロールバーの幅を取得
  getScrollbarWidth (element) {
    return element.offsetWidth - element.clientWidth
  }

  // Drawer内に複製したい要素を複製する（順序指定も可能）
  returnDrawerInElemsArray (targets) {
    const list = {}
    const reverseTargets = Array.from(targets).reverse()
    let sortNumberBefore = 0
    const targetsLength = reverseTargets.length

    for (let i = 0; i < targetsLength; i++) {
      const $target = reverseTargets[i]
      const $clone = $target.cloneNode(true)
      const data = $clone.getAttribute('data-drawer')
      const dataArray = data.split(',')

      const sortNumber = parseInt(dataArray[0], 10)
      const addClassName = dataArray[1] ? dataArray[1] : ''

      $clone.className = ''
      $clone.removeAttribute('id')
      $clone.className = addClassName
      const key = sortNumberBefore === sortNumber ? sortNumber + 1 : sortNumber

      list[key] = $clone

      sortNumberBefore = sortNumber

      $clone.removeAttribute('data-drawer')
    }

    return Object.values(list)
  }

  appendDrawerInElems ($element, list) {
    list.forEach((item) => {
      $element.appendChild(item)
    })
  }
}
