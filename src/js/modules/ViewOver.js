/**
 * # headerとfooterのviewport出現を検知しクラスを付与
 */
export class ViewOver {
  /**
   * constructor
   * @param {element} targetSelector
   */
  constructor(targetSelector) {
    this.target = targetSelector
    this.$onceScroll = document.createElement('div')
    this.$onceScroll.setAttribute('data-view-over', 'once-scroll') // body直下に配置 一度でもスクロールしたらを測るためのチェック要素
    this.$onceScroll.style.cssText = 'position: absolute;top: 0;left: 0;'

    /**
     * 初期化
     */
    this.init = function () {
      document.body.insertAdjacentElement('afterbegin', this.$onceScroll)

      if (!document.querySelector(this.target)) return false

      // 要素
      this.el = {
        $targets: document.querySelectorAll(this.target),
      }

      // 初期設定 - https://blog.jxck.io/entries/2016-06-25/intersection-observer.html
      this.config = {
        root: null,
        rootMargin: '0px 0px',
        threshold: this.calcThresholds(0),
      }

      const observer = new IntersectionObserver(this.callback, this.config)

      for (const key of Object.keys(this.el.$targets)) {
        observer.observe(this.el.$targets[key])
      }

      return true
    }
  }

  /**
   * thresholdのステップを計算
   * @param {number} numSteps ステップ数
   */
  calcThresholds(numSteps) {
    const thresholds = []

    for (let i = 1.0; i <= numSteps; i++) {
      const ratio = i / numSteps
      thresholds.push(ratio)
    }

    thresholds.push(0)
    return thresholds
  }

  /**
   * 処理：プロセス追加
   */
  callback(entries, observer) {
    entries.forEach((entry) => {
      const data = entry.target.getAttribute('data-view-over')

      if (data === 'header') {
        if (!entry.isIntersecting) {
          document.documentElement.classList.add('js-over-header')
        } else {
          document.documentElement.classList.remove('js-over-header')
        }
      } else if (data === 'once-scroll') {
        if (!entry.isIntersecting) {
          document.documentElement.classList.add('js-over-once-scroll')
        } else {
          document.documentElement.classList.remove('js-over-once-scroll')
        }
      } else if (data === 'content') {
        if (entry.isIntersecting) {
          document.documentElement.classList.add('js-view-content')
        } else {
          document.documentElement.classList.remove('js-view-content')
        }
      } else if (data === 'headerInfo') {
        if (entry.isIntersecting) {
          document.documentElement.classList.add('js-view-headerInfo')
        } else {
          document.documentElement.classList.remove('js-view-headerInfo')
        }
      } else if (data === 'footer') {
        if (entry.isIntersecting) {
          document.documentElement.classList.add('js-view-footer')
        } else {
          document.documentElement.classList.remove('js-view-footer')
        }
      }
    })
  }
}
