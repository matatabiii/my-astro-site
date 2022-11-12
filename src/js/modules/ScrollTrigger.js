// TODO: 順序指定
export class ScrollTrigger {
  constructor (props = {}) {
    this.props = props
    this.config = {}
    this.triggerClassName = 'is-observed'
    this.waitClassName = 'is-waiting'

    const { target } = this.props

    target.classList.add(this.waitClassName)
    this.config.duration = target.dataset.stDuration || 500
    this.config.delay = target.dataset.stDelay || 0
    this.config.easing = target.dataset.stEasing || 'ease-in-out'

    this.config = { ...this.config, ...props }
  }

  init () {
    const { target } = this.props

    this.options = {
      root: null,
      rootMargin: '-15% 0px',
      threshold: this.buildThresholdList(1.0)
    }

    if (!this.config.notTransition) {
      // duration, delay, ...etc 初期発火
      target.style.transitionDuration = `${this.config.duration}ms`
      target.style.transitionDelay = `${this.config.delay}ms`
      target.style.transitionTimingFunction = this.config.easing

      target.addEventListener('transitionend', this.onTransitionend)
    }

    this.observe()
  }

  /**
   * トランジション終了後インラインスタイルを削除
   */
  onTransitionend (e) {
    e.currentTarget.style.transitionDuration = ''
    e.currentTarget.style.transitionDelay = ''
    e.currentTarget.style.transitionTimingFunction = ''
    e.currentTarget.removeEventListener('transitionend', this.onTransitionend)
  }

  /**
   * 閾値のリストを作成
   * @param  {Number} steps 閾値を何分割するか
   * @return {Number}       閾値のリスト
   */
  buildThresholdList (steps) {
    const thresholds = []

    for (let i = 1.0; i <= steps; i++) {
      const ratio = i / steps
      thresholds.push(ratio)
    }

    thresholds.push(0)
    return thresholds
  }

  handleIntersect (entries, observer) {
    entries.forEach((entry) => {
      const target = entry.target

      if (entry.isIntersecting) {
        target.classList.add(this.triggerClassName)
        target.classList.remove(this.waitClassName)
        observer.unobserve(target)
      }
    })
  }

  observe () {
    this.observer = new IntersectionObserver((entries, observer) => {
      this.handleIntersect(entries, observer)
    }, this.options)
    this.observer.observe(this.props.target)
  }
}
