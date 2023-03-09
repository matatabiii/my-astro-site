import { createDrawer } from './modules/drawer.js'
import { SmoothScroll } from './modules/smoothScroll.js'

import { Mouseenter, Mouseleave } from './modules/Helper'
import { ViewOver } from './modules/ViewOver.js'

const mqlMd = window.matchMedia('(max-width: 767px)')
const cloneTarget = document.getElementById('global-menu')
/* ドロワーのラッパー作成 */
const drawer = createDrawer(cloneTarget)

/*
 * スムーススクロール
 */
const smoothScrollSelector = 'a[href],[data-href]'
const smoothScroll = new SmoothScroll(smoothScrollSelector, {
  duration: 900,
  // offset: '#header',
  callback: (elem) => {
    drawer.setClose(drawer.drawerElement)
  },
})
smoothScroll.init()

const detailsNodes = document.querySelectorAll('details')
if (detailsNodes.length) {
  ;(async () => {
    const { detailsUi } = await import('./modules/details.js')
    detailsUi(detailsNodes)
  })()
}

const hrefNodes = document.querySelector('a[href]:not(.js-ignore), [data-href]:not([data-href="#body"])')
if (hrefNodes) {
  ;(async () => {
    const { currentHref } = await import('./modules/currentHref.ts')
    currentHref().set()
  })()
}

/**
 * マウスオーバー
 */
const onmouseenterSelector = '[data-onmouseenter]'
if (document.querySelector(onmouseenterSelector)) {
  const hoverIn = new Mouseenter(onmouseenterSelector, (event) => {
    event.preventDefault()
    const className = event.currentTarget.dataset.onmouseenter
    event.currentTarget.classList.add(className)
    event.currentTarget.classList.add('js-onmouseenter')

    const showContent = event.currentTarget.querySelector('.js-show-content')
    showContent && showContent.setAttribute('aria-hidden', 'false')
  })
  hoverIn.init()
}

/**
 * マウスアウト
 */
const onmouseleaveSelector = '[data-onmouseleave]'
if (document.querySelector(onmouseleaveSelector)) {
  const hoverOut = new Mouseleave(onmouseleaveSelector, (event) => {
    event.preventDefault()
    const className = event.currentTarget.dataset.onmouseleave

    if (event.currentTarget.classList.contains('js-onmouseenter')) {
      event.currentTarget.classList.remove(className)
      event.currentTarget.classList.remove('js-onmouseenter')

      const showContent = event.currentTarget.querySelector('.js-show-content')
      showContent && showContent.setAttribute('aria-hidden', 'true')
    }
  })
  hoverOut.init()
}

/*
Splide
```
<div class="js-splide c-container c-container--small">
  <div class="splide c-splide u-of-hidden" aria-label="スライダー" data-autoplay="true" data-splide='{"type":"false","perPage":1,"breakpoints":{"768":{"perPage":2},"1024":{"perPage":3}}}'>
    <div class="splide__track">
      <ul class="splide__list">
        <li class="splide__slide">
          <Picture ext="jpg" src={`${root}assets/images/environment/slide-a-a`} alt="サンプルの写真" width={820} height={550} className="" media="" mobileWidth="" mobileHeight="" />
        </li>
        <li class="splide__slide">
          <Picture ext="jpg" src={`${root}assets/images/environment/slide-a-b`} alt="サンプルの写真" width={820} height={550} className="" media="" mobileWidth="" mobileHeight="" />
        </li>
        <li class="splide__slide">
          <Picture ext="jpg" src={`${root}assets/images/environment/slide-a-c`} alt="サンプルの写真" width={820} height={550} className="" media="" mobileWidth="" mobileHeight="" />
        </li>
      </ul>
    </div>

    <div class="splide__arrows c-splide-arrows">
      <button class="splide__arrow splide__arrow--prev c-splide-arrow c-splide-arrow--prev">Prev</button>
      <button class="splide__arrow splide__arrow--next c-splide-arrow c-splide-arrow--next">Next</button>
    </div>
    <ul class="splide__pagination c-splide-pagination"></ul>
  </div>
</div>
```
*/
const splideNodes = document.querySelectorAll('.js-splide')
if (splideNodes.length) {
  ;(async () => {
    const { Splide } = await import('@splidejs/splide')
    const { Intersection } = await import('@splidejs/splide-extension-intersection')

    for (let index = 0; index < splideNodes.length; index++) {
      const splideNode = splideNodes[index]
      const target = splideNode.querySelector('.splide')
      const isAutoplay = (target.dataset.autoplay && target.dataset.autoplay === 'true') || false

      const config = {
        type: 'fade',
        classes: {
          // 矢印関連のクラスを追加
          arrows: 'splide__arrows c-splide-arrows',
          arrow: 'splide__arrow c-splide-arrow',
          prev: 'splide__arrow--prev c-splide-arrow--prev',
          next: 'splide__arrow--next c-splide-arrow--next',
          // ページネーション関連のクラスを追加
          pagination: 'splide__pagination c-splide-pagination', // container
          page: 'splide__pagination__page c-splide-pagination__page', // each button
        },
        easing: 'cubic-bezier(.68,.5,.3,.84)',
        mediaQuery: 'min',
        noDrag: 'button, span, svg',
        waitForTransition: false,
        rewindSpeed: 1000,
        rewind: true,
        updateOnMove: true,
        trimSpace: true,
        interval: 5000, // 自動再生の間隔
        autoplay: 'pause',
        arrows: true,
        pagination: true,
        snap: true,
      }

      if (isAutoplay) {
        config.intersection = {
          rootMargin: '5% 0px',
          inView: {
            autoplay: true,
          },
          outView: {
            autoplay: false,
          },
        }
      }

      const splide = new Splide(target, config)
      splide.mount({ Intersection })
    }
  })()
}

if (mqlMd.matches) {
  const mdDetails = document.querySelectorAll('[data-md-details="main"]')

  mdDetails?.forEach((mdDetailsTarget) => {
    const details = document.createElement('details')
    const summary = document.createElement('summary')
    const summaryBase = mdDetailsTarget.querySelector('[data-md-details="summary"]')
    const detailsContent = mdDetailsTarget.querySelector('[data-md-details="content"]')
    const summaryHeader = summaryBase.children[0]
    summary.classList.add(summaryBase.classList)
    details.classList.add(mdDetailsTarget.classList)
    details.classList.add('js-details')

    summary.insertAdjacentElement('beforeend', summaryHeader)
    details.insertAdjacentElement('beforeend', summary)
    details.insertAdjacentElement('beforeend', detailsContent)
    mdDetailsTarget.replaceWith(details)
  })

  ;(async () => {
    const { detailsUi } = await import('./modules/details.js')
    detailsUi(document.querySelectorAll('.js-details'), '[data-md-details="content"]')
  })()
}


/*
 * ViewOver
 */
const viewOver = new ViewOver('[data-view-over]')
viewOver.init()
