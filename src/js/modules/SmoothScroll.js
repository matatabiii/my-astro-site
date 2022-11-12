/// スムーススクロール
export class SmoothScroll {
  constructor (targetSelector, options) {
    this.target = targetSelector
    this.options = {
      ...{
        duration: 1000,
        offset: 0
      },
      ...options
    }
  }

  init () {
    this.setOffset()

    // ロード時にURLのハッシュの要素までスクロール
    if (window.location.hash) {
      this.scrollToHash(window.location.hash)
    }

    this.targets = document.querySelectorAll(this.target)

    // リンクのhrefが現在のページ内にある場合は、代わりにそれまでスクロール
    this.targets.forEach((a) => {
      a.addEventListener('click', (e) => {
        this.clearCurrentClass()
        this.scrollToHash(this.getSamePageAnchor(a), e)
      })
    })
  }

  // カレントクラス付与のクリア
  clearCurrentClass () {
    // アイテムのステート管理
    const notCurrent = Array.from(this.targets).filter(($target) => {
      return $target.classList.contains('is-current-href')
    })

    notCurrent.forEach(($target) => {
      $target.classList.remove('is-current-href')
    })
  }

  // offsetが要素の場合、数値に変換
  setOffset () {
    if (typeof this.options.offset !== 'number') {
      const offsetElem = document.querySelector(this.options.offset)
      if (offsetElem) {
        this.options.offset = parseFloat(offsetElem.offsetHeight)
      }
    }
  }

  // リンクが同じページか判断
  getSamePageAnchor (linkTarget) {
    let link = linkTarget
    const dataHref = link.dataset.href

    if (dataHref) {
      link = document.createElement('a')
      link.href = dataHref
    }

    if (
      link.protocol !== window.location.protocol ||
      link.host !== window.location.host ||
      link.pathname !== window.location.pathname ||
      link.search !== window.location.search
    ) {
      return false
    }

    return link.hash
  }

  /**
   * アニメーションのイージング関数
   * 参考：ICS Media
   * @param x
   * @returns {number}
   */
  easeOutQuart (x) {
    return 1 - Math.pow(1 - x, 4)
  }

  /**
   * フレームごとにスクロールを実行
   * 参考：ICS Media
   */
  animation (options) {
    const progress = Math.min(1, (Date.now() - this.startTime) / options.duration)
    const scrollValX = this.startPositionX + (this.endPositionX - this.startPositionX) * this.easeOutQuart(progress)
    const scrollValY = this.startPositionY + (this.endPositionY - this.startPositionY) * this.easeOutQuart(progress)
    window.scrollTo(scrollValX, scrollValY)
    if (progress < 1) {
      this.animationId = window.requestAnimationFrame(() => {
        this.animation(options)
      })
    }
  }

  /**
   * アニメーションをキャンセル
   * 参考：ICS Media
   */
  cancelScroll () {
    window.cancelAnimationFrame(this.animationId)
  }

  /**
   * スクロールアニメーションを実行
   * 参考：ICS Media
   * @param targetElement
   */
  scrollTo (targetElement, setOptions) {
    const options = setOptions ? { ...this.options, ...setOptions } : this.options

    const targetY = this.calcTargetY(targetElement, this.options.offset)
    const target = { y: targetY }
    this.startPositionX = window.scrollX
    this.startPositionY = window.scrollY
    this.endPositionX = target.x != null ? target.x : window.scrollX
    this.endPositionY = target.y != null ? target.y : window.scrollY
    this.startTime = Date.now()
    this.animation(options)
    // console.log(targetY)
  }

  calcTargetY (targetElement, offsetY) {
    // ページ全体の高さ
    const documentHeight = document.body.clientHeight
    // ターゲットのY座標取得
    if ((targetElement.getBoundingClientRect().top + window.scrollY) + window.innerHeight > documentHeight) {
      // ターゲットのY座標+ウィンドウ高さがページ全体の高さを超えたとき（＝そこまでスクロールできない）は、ページ一番したまでの位置を取得
      return documentHeight - window.innerHeight - offsetY
    } else {
      // ターゲットのY座標
      return targetElement.getBoundingClientRect().top + window.scrollY - offsetY
    }
  }

  // 特定要素を取得し移動
  scrollToHash (hash, e) {
    const elem = hash ? document.querySelector(hash) : false
    if (elem) {
      if (e) {
        e.preventDefault()
        e.currentTarget.classList.add('is-current-href')
      }
      if (this.options.callback) this.options.callback(elem)

      this.scrollTo(elem)
    }
  }
}
