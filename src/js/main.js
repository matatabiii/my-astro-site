import { isMedia, resize } from './modules/Utility'
import { Lazyload } from './modules/Lazyload'
import { CurrentHref } from './modules/CurrentHref'
import { SmoothScroll } from './modules/SmoothScroll'
import { LogicDrawer } from './modules/LogicDrawer'
// import Tween24 from 'tween24'

import {
  autoToHalfWidthNum,
  formBeforeunload,
  helperCF7,
  inputKeybindCopyText,
  Mouseenter,
  Mouseleave
} from './modules/Helper'
import { ViewOver } from './modules/ViewOver'

/*
 * ViewOver
 */
// const autoPlayVideoSelector = '.js-autoPlayVideo'
// if (document.querySelector(autoPlayVideoSelector)) {
//   async function fetchAutoPlayVideoModule () {
//     const module = await import('./modules/AutoPlayVideo')
//     const autoPlayVideo = new module.AutoPlayVideo(document.querySelector(autoPlayVideoSelector))
//     autoPlayVideo.init()
//     console.log('get module AutoPlayVideo')
//   }
//   fetchAutoPlayVideoModule()
// }

/**
 * Lazyload
 */
if (document.querySelector('[data-src]:not(.js-lazyloaded),[data-srcset]:not(.js-lazyloaded)')) {
  const lazyload = new Lazyload()
  lazyload.setPlaceholder()
  lazyload.go()
}

if (document.getElementById('kv-fader')) {
  async function fetchFaderModule () {
    const module = await import('./modules/LogicFader')
    const kvFader = new module.LogicFader(document.getElementById('kv-fader'))
    kvFader.init()
    console.log('get module Fader')
  }
  fetchFaderModule()
}

/**
 * Drawer
 */
const Drawer = new LogicDrawer()
Drawer.init()
// Drawer.setChecked(true)

const currentHrefInstance = new CurrentHref()
currentHrefInstance.init()

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
    }
  })
  hoverOut.init()
}

/**
 * 100vh
 */
const calc100vhSelector = '.js-calc100vh'
if (document.querySelector(calc100vhSelector) && isMedia('breakLg')) {
  const calc100vhUpdate = () => {
    document.querySelectorAll(calc100vhSelector).forEach((element) => {
      const vh = window.innerHeight + 'px'
      element.style.height = vh
    })
  }
  calc100vhUpdate()

  // resizeイベントの取得
  window.addEventListener(resize, () => {
    calc100vhUpdate()
  })
}

/**
 * Tab
 */
const tabSelector = '.js-tab'
if (document.querySelector(tabSelector)) {
  async function fetchTabModule () {
    const module = await import('./modules/LogicTab')
    const tabInstance = new module.LogicTab(tabSelector)
    tabInstance.init()
    console.log('get module LogicTab')
  }
  fetchTabModule()
}

/*
 * ヘルパー（CF7サポート, 電話番号トラッキングイベント付与）
 */
helperCF7('[data-form="cf7"]')
autoToHalfWidthNum()
formBeforeunload()
const inputKeybindCopyTextSelector = '[data-inputCopyText]'
if (document.querySelector(inputKeybindCopyTextSelector)) {
  inputKeybindCopyText(document.querySelector(inputKeybindCopyTextSelector))
}
document.documentElement.classList.add('complete')

/**
 * Accordion
 */
const accordionSelector = '.js-accordion'
if (document.querySelector(accordionSelector)) {
  async function fetchAccordionModule () {
    const module = await import('./modules/LogicAccordion')
    document.querySelectorAll(accordionSelector).forEach((target) => {
      const accordionInstance = new module.LogicAccordion({
        accordionElem: target
      })
      accordionInstance.init()
    })
    console.log('get module LogicAccordion')
  }
  fetchAccordionModule()
}

/**
 * Slider
 */
const splideSelector = '.js-splide'
if (document.querySelector(splideSelector)) {
  async function fetchSplideModule () {
    const module = await import('./modules/Slider')

    document.querySelectorAll(splideSelector).forEach((target) => {
      const splideWrapper = new module.SplideWrapper({
        target: target
      })
      splideWrapper.mount()
    })

    console.log('get module SplideWrapper')
  }
  fetchSplideModule()
}

/**
 * Slider
 */
const stSelector = '.js-scrollTrigger'
if (document.querySelector(stSelector)) {
  async function fetchSliderModule () {
    const module = await import('./modules/ScrollTrigger')

    document.querySelectorAll(stSelector).forEach((target) => {
      const st = new module.ScrollTrigger({
        target: target
      })
      st.init()
    })

    console.log('get module ScrollTrigger')
  }
  fetchSliderModule()
}

/**
 * SplitText
 */
const splitTextSelector = '.js-SplitText'
if (document.querySelector(splitTextSelector)) {
  async function fetchSplitTextModule () {
    const module = await import('./modules/SplitText')

    document.querySelectorAll(splitTextSelector).forEach((target) => {
      const SplitText = new module.SplitText({
        target: target
      })
      SplitText.init()
    })

    console.log('get module SplitText')
  }
  fetchSplitTextModule()
}

/*
 * スムーススクロール
 */
const smoothScrollSelector = 'a[href],[data-href]'
if (document.querySelector(smoothScrollSelector)) {
  const smoothScroll = new SmoothScroll(smoothScrollSelector, {
    duration: 900,
    // offset: isMedia('overLg') ? '.l-header-base' : '.l-header-base',
    callback: (elem) => {
      if (Drawer.isOpen) {
        Drawer.setChecked(false)
      }
    }
  })
  smoothScroll.init()
}

/*
 * ViewOver
 */
const viewOverSelector = '[data-view-over]'
if (document.querySelector(viewOverSelector)) {
  const viewOver = new ViewOver(viewOverSelector)
  viewOver.init()
}


const detailsNodes = document.querySelectorAll('details')
if (detailsNodes.length) {
  (async () => {
    const { detailsUi } = await import('./modules/details.js')
    detailsUi(detailsNodes)
  })()
}
