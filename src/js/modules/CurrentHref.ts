import { getPath } from './Utility'

/*
 * カレントリンクのアクティブ化
 */

// # http://10.0.1.23:3000/sample/#body
// - ./sample/
// - /sample/
// - /sample/index.html
// - /sample/index.php
// - http://10.0.1.23:3000/sample/
// - http://10.0.1.23:3000/sample
interface Path {
  root: string
  assets: string
}
export class CurrentHref {
  target: string
  flagSelector: string
  classCurrnet: string
  classParent: string
  path: Path
  root: string
  current: string
  pathname: string

  constructor (targetSelector: string = 'a[href]:not(.js-ignore), [data-href]:not([data-href="#body"])') {
    this.target = targetSelector
    this.flagSelector = 'js-current'
    this.classCurrnet = 'is-current'
    this.classParent = 'is-current-parent'
    this.path = getPath()
    this.root = this.getUrlObject(this.path.root).href
    // this.root = this.root.replace(/\/$/, '')
    this.current = window.location.protocol + '//' + window.location.host + window.location.pathname
    this.pathname = '/' + this.current.replace(this.root, '')
  }

  init () {
    // 一度対象にされた要素のクラスを削除
    if (document.querySelector(this.flagSelector)) {
      document.querySelectorAll<HTMLElement>(this.flagSelector).forEach((target) => {
        target.classList.remove(this.flagSelector)
        target.classList.remove(this.classCurrnet)
        target.classList.remove(this.classParent)
      })
    }

    // カレントクラス付与
    const aTags = document.querySelectorAll<HTMLAnchorElement>(this.target)
    const parentsList = this.pathname.split('/').filter(Boolean)
    // console.log(window.location.pathname, this.root)

    aTags.forEach((aTag) => {
      if (this.getSamePageAnchor(aTag)) {
        aTag.classList.add(this.classCurrnet)
        aTag.classList.add(this.flagSelector)
      }

      let isParrentTag = false

      if (aTag.dataset.href) {
        const link = this.getUrlObject(aTag.dataset.href)
        const linkPathName = '/' + link.href.replace(this.root, '')
        isParrentTag = parentsList[0] === linkPathName.replace(/\//g, '')
      } else if (aTag.pathname) {
        const aTagPathName = '/' + aTag.href.replace(this.root, '')
        isParrentTag = parentsList[0] === aTagPathName.replace(/\//g, '')
      }

      if (isParrentTag) {
        aTag.classList.add(this.classParent)
        aTag.classList.add(this.flagSelector)
      }
    })
  }

  getUrlObject (path:string) {
    const link = document.createElement('a')
    link.href = path
    return link
  }

  // リンクが同じページか判断
  getSamePageAnchor (linkTarget:HTMLAnchorElement) {
    let link = linkTarget
    const dataHref = link.dataset.href

    if (dataHref) {
      link = this.getUrlObject(dataHref)
    }

    if (
      link.protocol !== window.location.protocol ||
      link.host !== window.location.host ||
      link.pathname !== window.location.pathname ||
      link.search !== window.location.search
    ) {
      return false
    }

    return true
  }
}
