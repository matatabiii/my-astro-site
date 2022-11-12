import { matchMedia } from './Utility'

interface config {
  accordionElem: HTMLElement | null
  triggerSelector: string
  contentSelector: string
  stateClassName: string
  duration: number
}

interface accordions {
  accordionElem: HTMLElement | null
  trigger: HTMLElement | null
  content: HTMLElement | null
  isOpen: boolean
  mq: string
}

interface animationOptions {
  animationTarget: HTMLElement
  startHeight: number
  endHeight: number
  duration: number
  easing: Function
}

export class LogicAccordion {
  animationId: number
  userConfig: Object
  config: config
  accordions: accordions
  // protected clickEventListener: Function

  constructor (userConfig: Object = {}) {
    this.userConfig = userConfig
    this.animationId = 0
    this.config = {
      ...{
        accordionElem: document.querySelector('.js-accordion'),
        triggerSelector: '[data-accordion="summary"]',
        contentSelector: '[data-accordion="content"]',
        stateClassName: 'is-open',
        duration: 350
      },
      ...this.userConfig
    }

    this.accordions = {
      accordionElem: this.config.accordionElem,
      trigger: this.config.accordionElem ? this.config.accordionElem.querySelector(this.config.triggerSelector) : null,
      content: this.config.accordionElem ? this.config.accordionElem.querySelector(this.config.contentSelector) : null,
      isOpen: this.config.accordionElem
        ? this.config.accordionElem.classList.contains(this.config.stateClassName)
        : false,
      mq: this.config.accordionElem ? this.config.accordionElem.dataset.mq || '' : ''
    }

    this.onClick = this.onClick.bind(this)
  }

  /**
   * アニメーションのイージング関数
   * 参考：ICS Media
   * @param x
   * @returns {number}
   */
  easeOutQuart (x: number) {
    return 1 - Math.pow(1 - x, 4)
  }

  easeInOutQuad (x: number) {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
  }

  init () {
    if (!this.accordions.mq) {
      this.create()
    } else {
      const hundleMatchMedia = matchMedia()
      const mql = hundleMatchMedia.breakPoint[this.accordions.mq]
      const handleMql = () => {
        if (mql.matches) {
          this.create()
        } else {
          this.destroy()
        }
      }
      mql.onchange = handleMql
      handleMql() // 初期実行
    }
  }

  create () {
    if (!this.accordions.content || !this.accordions.trigger) {
      console.log('Accordion target element undefined')
      return
    }

    this.accordions.content.style.overflow = 'hidden'
    this.accordions.trigger.addEventListener('click', this.onClick, false)

    if (this.accordions.isOpen) {
      // アクセシビリティ
      this.open(this.accordions, false)
    } else {
      // アクセシビリティ
      this.close(this.accordions, false)
    }
  }

  destroy () {
    if (!this.accordions.accordionElem || !this.accordions.trigger || !this.accordions.content) {
      console.log('Accordion target element undefined')
      return
    }

    this.accordions.content.style.overflow = ''
    this.open(this.accordions, false)
    this.accordions.accordionElem.classList.remove(this.config.stateClassName)
    this.accordions.trigger.removeEventListener('click', this.onClick, false)
  }

  onClick (event: Event) {
    event.preventDefault()
    this.slideToggle(this.accordions)
  }

  slideToggle (accordions: accordions) {
    if (accordions.isOpen) {
      this.close(accordions)
    } else {
      this.open(accordions)
    }
  }

  open (accordions: accordions, isAnimation = true) {
    const { accordionElem, trigger, content } = accordions

    if (!accordionElem || !trigger || !content) {
      console.log('Accordion open method is not find target element')
      return
    }

    const options = {
      animationTarget: content,
      startHeight: content ? content.offsetHeight : 0,
      endHeight: content ? content.scrollHeight : 0,
      duration: this.config.duration,
      easing: this.easeInOutQuad
    }

    accordions.isOpen = true

    if (isAnimation) {
      this.animation(options, () => {
        content.style.height = ''
        accordionElem.classList.add(this.config.stateClassName)
        trigger.setAttribute('aria-selected', 'true')
        content.setAttribute('aria-hidden', 'false')
        content.setAttribute('aria-expanded', 'true')
      })
    } else {
      content.style.height = ''
      trigger.setAttribute('aria-selected', 'true')
      content.setAttribute('aria-hidden', 'false')
      content.setAttribute('aria-expanded', 'true')
    }
  }

  close (accordions: accordions, isAnimation = true) {
    const { accordionElem, trigger, content } = accordions

    if (!accordionElem || !trigger || !content) {
      console.log('Accordion close method is not find target element')
      return
    }

    const options: animationOptions = {
      animationTarget: content,
      startHeight: content.offsetHeight,
      endHeight: 0,
      duration: this.config.duration,
      easing: this.easeInOutQuad
    }

    accordions.isOpen = false

    if (isAnimation) {
      this.animation(options, () => {
        content.style.height = '0'
        accordionElem.classList.remove(this.config.stateClassName)
        trigger.setAttribute('aria-selected', 'false')
        content.setAttribute('aria-hidden', 'true')
        content.setAttribute('aria-expanded', 'false')
      })
    } else {
      content.style.height = '0'
      trigger.setAttribute('aria-selected', 'false')
      content.setAttribute('aria-hidden', 'true')
      content.setAttribute('aria-expanded', 'false')
    }
  }

  animation (options: animationOptions, cb: Function) {
    const { animationTarget, startHeight, endHeight, duration, easing } = options
    const startTime = Date.now() // window.performance.now()

    // 進捗アップデート
    const update = () => {
      const progress = Math.min(1, (Date.now() - startTime) / duration)
      const easingProgress = easing(progress)

      const height = Math.min(startHeight + (endHeight - startHeight) * easingProgress)
      animationTarget.style.height = height + 'px'

      if (easingProgress < 1) {
        this.animationId = window.requestAnimationFrame(update)
      } else {
        if (cb) {
          cb()
        }
      }
    }

    window.requestAnimationFrame(update)
  }
}

/*
<section class="js-accordion">
  <header
    data-accordion="summary"
    class="u-pt20 u-pb20 u-gutter u-bgColor-theme u-color-white u-size20 M:u-size24"
  >
    アコーディオン
  </header>
  <div data-accordion="content">
    <div class="u-bgColor-gray u-gutter u-pt20 u-pb20">
      <p>アコーディオンコンテンツ！！</p>
      <p>アコーディオンコンテンツ！！</p>
      <p>アコーディオンコンテンツ！！</p>
      <p>アコーディオンコンテンツ！！</p>
      <p>アコーディオンコンテンツ！！</p>
    </div>
  </div>
</section>
*/
