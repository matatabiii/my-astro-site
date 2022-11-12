/**
 * Lazyload
 */

export class Lazyload {
  srcSelector:string

  constructor (srcSelector = 'img[data-src]:not(.js-lazyloaded)') {
    this.srcSelector = srcSelector
  }

  go () {
    if (document.querySelector<HTMLImageElement>(`${this.srcSelector}`)) {
      if (this.isNative()) {
        this.native()
        console.log('Lazyload: Native')
      } else {
        this.polyfill()
        console.log('Lazyload: none Native')
      }
    }
  }

  isNative () {
    return 'loading' in window.HTMLImageElement.prototype
  }

  // data属性をsrcに変換
  toSrc (img:HTMLImageElement) {
    const dataSrc = img.dataset.src
    if (dataSrc) {
      const parent = img.parentNode as HTMLElement
      if (parent?.nodeName === 'PICTURE') {
        // handles special <picture><source> case
        Array.from(parent.getElementsByTagName('source')).forEach(
          (source: HTMLSourceElement) => {
            const dataSrcSet = source.dataset.srcset
            if (!img.hasAttribute('srcset') && dataSrcSet) {
              source.srcset = dataSrcSet
              source.removeAttribute('data-srcset')
            }
          }
        )
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
    img.classList.add('js-lazyloaded')
  }

  // loading="lazy"に対応しているブラウザ用
  native () {
    const srcs = document.querySelectorAll<HTMLImageElement>(this.srcSelector)
    srcs.forEach(img => {
      this.toSrc(img)
    })
  }

  // loading="lazy"に対応していないブラウザ用
  polyfill () {
    // if (!('IntersectionObserver' in window)) {
    // }

    const lazyImages = document.querySelectorAll<HTMLImageElement>(`${this.srcSelector}`)
    const options = {
      rootMargin: '15% 0px'
    }
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          this.toSrc(img)
          observer.unobserve(img)
        }
      })
    }, options)

    lazyImages.forEach((lazyImage) => {
      lazyImageObserver.observe(lazyImage)
    })
  }

  setPlaceholder (placeholderSelector = 'img[data-placeholder]') {
    const imgs = document.querySelectorAll<HTMLImageElement>(placeholderSelector)

    if (!imgs.length) return

    imgs.forEach(img => {
      const width = img.getAttribute('width') || 0
      const height = img.getAttribute('height') || 0

      if (width > 0 && height > 0) {
        img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Crect fill='%23efefef' width='${width}' height='${height}'/%3E%3C/svg%3E`
      }
    })
  }
}
