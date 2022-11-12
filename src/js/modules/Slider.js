import Splide from '@splidejs/splide'
import { Intersection } from '@splidejs/splide-extension-intersection'

/*
<div
  class="js-splide"
  data-type="loop"
  data-autoplay="true"
  data-config="perPage:1,gap:10,loop:false,speed:500"
  data-config-md="perPage:4,gap:20,loop:false,speed:800"
  data-config-lg="perPage:2,perMove:2,gap:50,loop:false,speed:1000,padding:10%"
>
  <div class="splide">
    <div class="splide__track">
      <ul class="splide__list">
        <li class="splide__slide">
          <div class="u-w-400 u-mw-full u-h-100 u-bg-theme">Slide 01</div>
        </li>
        <li class="splide__slide">
          <div class="u-w-400 u-mw-full u-h-100 u-bg-theme">Slide 02</div>
        </li>
        <li class="splide__slide">
          <div class="u-w-400 u-mw-full u-h-100 u-bg-theme">Slide 03</div>
        </li>
        <li class="splide__slide">
          <div class="u-w-400 u-mw-full u-h-100 u-bg-theme">Slide 04</div>
        </li>
        <li class="splide__slide">
          <div class="u-w-400 u-mw-full u-h-100 u-bg-theme">Slide 05</div>
        </li>
        <li class="splide__slide">
          <div class="u-w-400 u-mw-full u-h-100 u-bg-theme">Slide 06</div>
        </li>
      </ul>
    </div>

    <div class="splide__arrows v-splide-arrows">
      <button class="splide__arrow splide__arrow--prev v-splide-arrows--prev">Prev</button>
      <button class="splide__arrow splide__arrow--next v-splide-arrows--next">Next</button>
    </div>

    <div class="splide__progress">
      <div class="splide__progress__bar"></div>
    </div>
  </div>
</div>
*/
export class SplideWrapper {
  constructor (props = {}) {
    this.props = props
  }

  mount () {
    const { target } = this.props

    const splideUi = target.querySelector('.v-splide-ui')

    this.interval = 0
    this.target = target
    this.configBreakpoints = this.createBreakpointsConfig()
    this.configBreakpointsBase = {
      speed: 2000 // number
      // perPage: 1 // number
      // padding: '0'
    }

    this.interval = 0 // autoplay用
    this.isAutoplay = this.target.dataset.autoplay && this.target.dataset.autoplay === 'true'
    this.type = this.target.dataset.type || 'slide'
    this.interval = this.target.dataset.interval ? parseInt(this.target.dataset.interval, 10) : 3500
    this.pagination = this.target.dataset.pagination
    if (this.target.dataset.pagination === 'true') {
      this.pagination = true
    } else if (this.target.dataset.pagination === 'false') {
      this.pagination = false
    } else {
      this.pagination = this.target.dataset.pagination
    }
    this.arrows = this.target.dataset.arrows ? this.target.dataset.arrows === 'true' : false
    this.itemLoaded = [] // lazyload

    // syncさせるか
    this.syncId = this.target.dataset.sync

    this.trimSpace = true
    if (this.target.dataset.trimSpace) {
      this.trimSpace = this.target.dataset.trimSpace === 'move' ? 'move' : false
    }

    const config = {
      type: this.type, // slide | loop | fade
      rewind: true, // true | false
      // speed: 2000, // number
      rewindSpeed: 500, // number
      gap: 30,
      // perPage: 1, // number
      pagination: this.pagination,
      arrows: this.arrows,
      waitForTransition: false,
      // drag: false,
      noDrag: 'button, span, svg',
      // perMove: 2, // 何枚のスライドで移動するか
      // focus: 'center', // number | 'center'
      updateOnMove: true,
      mediaQuery: 'min',
      trimSpace: this.trimSpace,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
      interval: 5000, // 自動再生の間隔
      // dragMinThreshold: {
      //   mouse: 1000,
      //   touch: 1000
      // },
      classes: {
        // 矢印関連のクラスを追加
        arrows: 'splide__arrows v-splide-arrows',
        arrow: 'splide__arrow v-splide-arrow',
        prev: 'splide__arrow--prev v-splide-arrows--prev',
        next: 'splide__arrow--next v-splide-arrows--next',
        // ページネーション関連のクラスを追加
        pagination: 'splide__pagination v-splide-pagination', // container
        page: 'splide__pagination__page v-splide-pagination-page' // each button
      },
      breakpoints: this.configBreakpoints
    }

    if (this.isAutoplay) {
      config.autoplay = 'pause' // pause = Autoplay#play()を用いて手動で再生
      config.intersection = {
        rootMargin: '5% 0px',
        inView: {
          autoplay: true
        },
        outView: {
          autoplay: false
        }
      }
    }

    if (this.target.dataset.isNavigation) {
      config.isNavigation = this.target.dataset.isNavigation === 'true'
    }

    const splide = new Splide(this.target.querySelector('.splide'), config)

    if (splideUi) {
      splide.on('pagination:mounted', (data) => {
        splideUi.insertAdjacentElement('beforeend', data.list)
      })
    }

    if (this.syncId) {
      const splideThumbnails = new SplideWrapper({
        target: document.querySelector(this.syncId)
      }).mount()

      splide.sync(splideThumbnails)
      splide.mount({ Intersection })
    } else {
      splide.mount({ Intersection })
    }

    return splide
  }

  createBreakpointsConfig () {
    const breakpointsBase = {}

    breakpointsBase['0'] = this.target.dataset.config
      ? this.toObject(this.target.dataset.config)
      : this.configBreakpointsBase
    breakpointsBase['768'] = this.target.dataset.configMd
      ? this.toObject(this.target.dataset.configMd)
      : this.configBreakpointsBase
    breakpointsBase['1024'] = this.target.dataset.configLg
      ? this.toObject(this.target.dataset.configLg)
      : this.configBreakpointsBase

    return breakpointsBase
  }

  toObject (text) {
    // splitを使って , で区切って、1つ1つの配列の値を replace して結合する？
    const newArray = text.split(',').map((i) => i.replace(/(\S+):(\S+)/, '"$1":"$2"'))
    const newText = newArray.join(',')
    return this.typeChange(JSON.parse(`{${newText}}`))
  }

  typeChange (obj) {
    const data = { ...obj }
    const numberLists = ['perPage', 'perMove', 'interval', 'gap', 'speed', 'easing', 'start', 'fixedWidth', 'fixedHeight']
    const booleanLists = ['loop', 'rewind', 'destroy', 'autoWidth', 'autoplay', 'isNavigation', 'trimSpace']

    numberLists.forEach((value) => {
      if (value in data) {
        data[value] = Number(data[value])
      }
    })

    booleanLists.forEach((value) => {
      if (value in data) {
        data[value] = data[value] === 'true'
      }
    })

    return data
  }

  // data-lazy-属性をsrcに変換
  toSrc (img) {
    const dataSrc = img.dataset.lazySrc
    if (dataSrc) {
      const parent = img.parentNode
      if (parent?.nodeName === 'PICTURE') {
        // handles special <picture><source> case
        Array.from(parent.getElementsByTagName('source')).forEach((source) => {
          const dataSrcSet = source.dataset.lazySrcset
          if (!img.hasAttribute('srcset') && dataSrcSet) {
            source.srcset = dataSrcSet
            source.removeAttribute('data-lazy-srcset')
          }
        })
      }
      if (img.dataset.lazySrc) {
        img.src = dataSrc
        img.removeAttribute('data-lazy-src')
      }
      if (!img.hasAttribute('srcset') && img.dataset.lazySrcset) {
        img.srcset = img.dataset.lazySrcset
        img.removeAttribute('data-lazy-srcset')
      }
    }
    img.classList.add('js-lazyloaded')
  }
}
