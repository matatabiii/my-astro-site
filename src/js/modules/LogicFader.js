
import { isMedia } from './Utility'

export class LogicFader {
  /**
   * constructor
   * @param {element} $target
   */
  constructor ($target) {
    /**
     * 初期化
     */
    this.init = () => {
      this.$target = $target

      if (!this.$target) return false

      // 初期設定
      this.defaultConfig = {
        delay: 3500,
        duration: 1500,
        easing: 'ease',
        timeout: 0,
        stop: 'true'
      }

      this.data = {} // データ

      this.config = this.$target.getAttribute('data-config') // 独自の設定を取得
      if (this.config) {
        this.config = this.convertToObject(this.config)
        this.data = { ...this.defaultConfig, ...this.config }
      } else {
        this.data = this.defaultConfig
      }
      if (!this.data.interval) {
        this.data.interval = this.data.duration
      }

      this.dataOptimisation() // データの型など最適化
      this.data.$children = this.$target.children
      this.data.$parent = this.$target.parentNode

      this.data.prefix = this.$target.getAttribute('id') !== 'undefined' ? this.$target.getAttribute('id') : ''
      this.data.prefix = typeof this.data.prefix === 'string' ? '-' + this.data.prefix : false

      this.data.firstIndex = 0

      this.data.currentIndex = this.data.firstIndex
      this.data.lastIndex = this.data.$children.length - 1
      this.data.pastCurrentIndex = this.data.lastIndex // 今までカレントだったアイテム（初期は最後のアイテム）
      this.data.pastCurrentItem = this.data.$children[this.data.pastCurrentIndex]

      this.firstTime()

      // トップメインのタイミングをsessionストレージの有無で変更したい場合
      if (this.data.session) {
        if (document.documentElement.classList.contains('js-onceTopPageAccessedFader') && !document.documentElement.classList.contains('home')) {
          return false
        }

        const session = window.sessionStorage.getItem(this.data.session)

        // 1度でもアクセスがあった場合（true）
        if (session === 'true') {
          document.documentElement.classList.add('js-onceTopPageAccessedFader')
          this.data.timeout = 50
        } else {
          window.sessionStorage.setItem('onceTopPageAccessedFader', 'true')
        }
      }

      setTimeout(() => {
        if (this.data.prefix) {
          document.documentElement.classList.add('js-fader-inited' + this.data.prefix)
        } else {
          this.$target.classList.add('js-fader-inited')
        }
      }, 50)

      setTimeout(() => {
        if (this.data.prefix) {
          document.documentElement.classList.add('js-fader-play' + this.data.prefix)
        } else {
          this.$target.classList.add('js-fader-play')
        }

        this.update()
        this.play()
      }, this.data.timeout)

      // mouseenter/mouseleaveでのループ停止再開
      if (this.data.stop) this.stop()

      // ナビゲーションを生成
      if (this.data.$parent.querySelector('.js-navigation')) {
        this.createNavigation()
        this.data.$navItems = this.data.$nav.children
      }

      // ナビゲーションを生成
      if (this.data.$parent.querySelector('.js-navigation-original')) {
        this.createNavigationOriginal()
        this.data.$navItems = this.data.$nav.children
      }

      return true
    }
  }

  /**
   * 最初に全てのアイテムに処理する内容
   */
  firstTime () {
    this.data.$children[this.data.firstIndex].style.transitionDuration = `${this.data.duration}ms`

    for (const key of Object.keys(this.data.$children)) {
      this.data.$children[key].style.transitionTimingFunction = this.data.easing
      this.data.$children[key].style.transitionProperty = 'opacity'
      this.data.$children[key].style.opacity = 0
    }
  }

  /**
   * データの型など最適化
   */
  dataOptimisation () {
    this.data.duration = parseInt(this.data.duration, 10) // 数値に変換
    this.data.timeout = parseInt(this.data.timeout, 10) // 数値に変換
    this.data.interval = parseInt(this.data.interval, 10) // 数値に変換
    this.data.delay = parseInt(this.data.delay, 10) + this.data.interval // 数値に変換
    this.data.stop = this.data.stop === 'true'
  }

  /**
   * データの更新
   */
  update () {
    this.data.prevIndex = this.data.currentIndex === this.data.firstIndex ? this.data.lastIndex : this.data.currentIndex - 1 // 1つ前のIndexを算出
    this.data.nextIndex = this.data.currentIndex === this.data.lastIndex ? this.data.firstIndex : this.data.currentIndex + 1 // 1つ次のIndexを算出

    this.data.currentItem = this.data.$children[this.data.currentIndex] // カレントアイテム
    this.data.prevItem = this.data.$children[this.data.prevIndex] // 1つ前のアイテム
    this.data.nextItem = this.data.$children[this.data.nextIndex] // 1つ次のアイテム

    const nextItemImg = this.data.nextItem.querySelector('img[data-lazy-src]')

    this.data.currentItem.classList.remove('is-active-next')
    this.data.pastCurrentItem.classList.remove('is-active')
    this.data.pastCurrentItem.style.zIndex = 'auto'
    this.data.pastCurrentItem.style.opacity = 0

    this.data.pastCurrentItem.style.transitionDuration = `${this.data.duration / 2}ms`

    const timeout = this.data.interval / 2

    setTimeout(() => {
      this.data.pastCurrentItem.style.transitionDuration = ''
      this.data.pastCurrentItem.classList.remove('is-active--delay')

      if (nextItemImg) {
        const dataSrc = nextItemImg.dataset.lazySrc
        if (dataSrc) {
          const parent = nextItemImg.parentNode
          if (parent?.nodeName === 'PICTURE') {
            // handles special <picture><source> case
            Array.from(parent.getElementsByTagName('source')).forEach((source) => {
              const dataSrcSet = source.dataset.lazySrcset
              if (!nextItemImg.hasAttribute('srcset') && dataSrcSet) {
                source.srcset = dataSrcSet
                source.removeAttribute('data-lazy-srcset')
              }
            })
          }
          if (nextItemImg.dataset.lazySrc) {
            nextItemImg.src = dataSrc
            nextItemImg.removeAttribute('data-lazy-src')
          }
          if (!nextItemImg.hasAttribute('srcset') && nextItemImg.dataset.lazySrcset) {
            nextItemImg.srcset = nextItemImg.dataset.lazySrcset
            nextItemImg.removeAttribute('data-lazy-srcset')
          }
        }
      }
    }, timeout.toFixed(1))

    this.data.currentItem.classList.add('is-active')
    this.data.currentItem.classList.add('is-active--delay')
    this.data.nextItem.classList.add('is-active-next')
    this.data.currentItem.style.zIndex = 1
    this.data.currentItem.style.opacity = 1
    this.data.currentItem.style.transitionDuration = `${this.data.duration}ms`

    if (this.data.autoHeight) {
      this.autoHeight(this.data.currentItem, this.data.autoHeight)
    }

    // ナビゲーションがあれば
    if (this.data.$navItems) {
      this.data.$navItems[this.data.pastCurrentIndex].classList.remove('is-active')
      this.data.$navItems[this.data.currentIndex].classList.add('is-active')
    }
  }

  /**
   * 自動高さ調整
   */
  autoHeight ($currentItem, mediaQuery) {
    $currentItem.style.height = 'auto'

    const height = $currentItem.offsetHeight

    if (height <= 0) return

    this.$target.style.transitionTimingFunction = 'ease-in-out'
    this.$target.style.transitionProperty = 'height'
    this.$target.style.transitionDuration = '.3s'

    if (mediaQuery !== 'undefined') {
      if (isMedia(mediaQuery)) {
        this.$target.style.height = `${height}px`
      } else {
        this.$target.style.height = 'auto'
      }
    } else {
      this.$target.style.height = `${height}px`
    }
  }

  /**
   * ループ再生
   */
  play () {
    this.timer = setInterval(() => {
      this.next()
    }, this.data.delay)
  }

  /**
   * 次のアイテムへ
   */
  next () {
    this.goTo(this.data.currentIndex + 1)
  }

  /**
   * 前のアイテムへ
   */
  prev () {
    this.goTo(this.data.currentIndex - 1)
  }

  /**
   * ループ停止
   */
  stop () {
    for (const key of Object.keys(this.data.$children)) {
      const $item = this.data.$children[key]

      $item.addEventListener('mouseenter', e => {
        this.clearInterval()
      }, false)

      $item.addEventListener('mouseleave', e => {
        this.play()
      }, false)
    }
  }

  /**
   * 任意のアイテムに移動
   */
  goTo (num) {
    this.data.pastCurrentIndex = this.data.currentIndex // 今までカレントだったアイテムを取得するためキャッシュ
    this.data.pastCurrentItem = this.data.$children[this.data.pastCurrentIndex] // 今までカレントだったアイテム

    /*
           * 最大アイテム数より大きければ最初のindex番号を適用
           * 最初のindex番号より小さければ最後のindex番号を適用
           * それ以外はその通りに適用
           */
    if (num > this.data.lastIndex) {
      this.data.currentIndex = this.data.firstIndex
    } else if (num < this.data.firstIndex) {
      this.data.currentIndex = this.data.lastIndex
    } else {
      this.data.currentIndex = num
    }

    this.update()
  }

  /**
   * ナビゲーションの生成
   */
  createNavigation () {
    this.data.$nav = this.data.$parent.querySelector('.js-navigation')

    if (this.data.lastIndex < 1) return

    for (let i = 0; i <= this.data.lastIndex; i++) {
      this.data.$navList = document.createElement('li')
      if (i === 0) this.data.$navList.classList.add('is-active')

      this.data.$navButton = document.createElement('button')
      this.data.$navButton.setAttribute('aria-label', (i + 1) + 'つ目に移動')
      this.data.$navButton.addEventListener('click', () => {
        this.goTo(i)
        clearInterval(this.timer)
        this.play()
      }, false)
      this.data.$navList.insertAdjacentElement('beforeend', this.data.$navButton)
      this.data.$nav.insertAdjacentElement('beforeend', this.data.$navList)
    }
  }

  /**
   * ナビゲーションの生成 - 中身が複雑な場合
   */
  createNavigationOriginal () {
    this.data.$nav = this.data.$parent.querySelector('.js-navigation-original')

    if (this.data.lastIndex < 1) return

    const $navLists = this.data.$nav.querySelectorAll('[data-list]')
    const navListsLength = $navLists.length

    for (let i = 0; i < navListsLength; i++) {
      if (i === 0) $navLists[i].classList.add('is-active')

      $navLists[i].setAttribute('aria-label', (i + 1) + 'つ目に移動')

      $navLists[i].addEventListener('click', () => {
        this.goTo(i)
        clearInterval(this.timer)
        this.play()
      }, false)

      $navLists[i].addEventListener('mouseenter', e => {
        this.goTo(i)
        clearInterval(this.timer)
        this.play()
      }, false)
    }
  }

  /**
   * インターバルクリア
   */
  clearInterval () {
    clearInterval(this.timer)
  }

  /**
   * # クエリ文字列からオブジェクトに変換するだけの機能
   * @param {string} string
   * @return {Object}
   */
  convertToObject (string) {
    const obj = {}

    string.split('&').forEach(pair => {
      const keyValue = pair.split('=')
      const key = decodeURIComponent(keyValue[0])
      const value = decodeURIComponent(keyValue[1])

      obj[key] = value
    })

    return obj
  }
}
