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
export const currentHref = (targetSelector: string = 'a[href]:not(.js-ignore), [data-href]:not([data-href="#body"])') => {
  const getUrlObject = (path:string) => {
    const link = document.createElement('a')
    link.href = path
    return link
  }

  const target:string = targetSelector
  const flagSelector:string = 'js-current'
  const classCurrnet:string = 'is-current'
  const classParent:string = 'is-current-parent'
  const path:string = document.documentElement.getAttribute('data-root') || '/'
  const root:string = getUrlObject(path).href
  const current:string = window.location.protocol + '//' + window.location.host + window.location.pathname
  const pathname:string = '/' + current.replace(root, '')

  // リンクが同じページか判断
  const getSamePageAnchor = (linkTarget:HTMLAnchorElement) => {
    let link = linkTarget
    const dataHref = link.dataset.href

    if (dataHref) {
      link = getUrlObject(dataHref)
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


  const set = () => {
    // 一度対象にされた要素のクラスを削除
    if (document.querySelector(flagSelector)) {
      document.querySelectorAll<HTMLElement>(flagSelector).forEach((target) => {
        target.classList.remove(flagSelector)
        target.classList.remove(classCurrnet)
        target.classList.remove(classParent)
      })
    }

    // カレントクラス付与
    const aTags = document.querySelectorAll<HTMLAnchorElement>(target)
    const parentsList = pathname.split('/').filter(Boolean)
    // console.log(window.location.pathname, root)

    aTags.forEach((aTag) => {
      if (getSamePageAnchor(aTag)) {
        aTag.classList.add(classCurrnet)
        aTag.classList.add(flagSelector)
      }

      let isParrentTag = false

      if (aTag.dataset.href) {
        const link = getUrlObject(aTag.dataset.href)
        const linkPathName = '/' + link.href.replace(root, '')
        isParrentTag = parentsList[0] === linkPathName.replace(/\//g, '')
      } else if (aTag.pathname) {
        const aTagPathName = '/' + aTag.href.replace(root, '')
        isParrentTag = parentsList[0] === aTagPathName.replace(/\//g, '')
      }

      if (isParrentTag) {
        aTag.classList.add(classParent)
        aTag.classList.add(flagSelector)
      }
    })
  }


  return {
    set
  }
}
