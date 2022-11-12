/** @var {Element} checkEl チェック用要素 */
export const checkEl = document.createElement('div')

/** @var {Element} html html */
export const html = document.documentElement

/** @var {Element} body body */
export const body = document.body

/** @var {Element} scrollable スクロール要素 */
export const scrollable =
  typeof document.scrollingElement !== 'undefined' ? document.scrollingElement : document.documentElement

/** @var {String} resizeリサイズ */
export const resize = typeof window.onorientationchange !== 'undefined' ? 'orientationchange' : 'resize'

/**
 * タッチデバイス判定
 * @return {Boolean}
 */
export function isTouchDevice () {
  return 'ontouchstart' in window
}

/**
 * カレントURL取得
 * @return {URL}
 */
export function getCurrentUrl () {
  return window.location.href.replace(window.location.protocol + '//' + window.location.host, '').replace(/\/+/g, '/')
}

/**
 * パスの取得
 * htmlに[data-root]or[data-assets]があればそれをセット、無ければデフォルトで / がルート
 */
interface Path {
  root: string
  assets: string
}
export function getPath (): Path {
  const root = html.getAttribute('data-root')
  const assets = html.getAttribute('data-assets')

  return {
    root: root || '/',
    assets: assets || '/assets/'
  }
}

/**
 * イベント発火
 */
export const triggerEvent = (event:string, $element:HTMLElement) => {
  const e = new Event(event, { bubbles: true, cancelable: true })
  $element.dispatchEvent(e)
}

/**
 * CSS で付与されている値を取得する
 */
export const getStyle = ($element: HTMLElement, style: string, pseudo: '' | ':before' | ':after') => {
  const element = typeof $element === 'object' ? $element : document.querySelector($element)
  if (!element) {
    return false
  }
  return window.getComputedStyle(element, pseudo).getPropertyValue(style).replace(/"/g, '').trim()
}

/**
 * メディアクエリー情報
 * @return {Object}
 */
interface BreakPoint {
  lg: number
  md: number
  sm: number
  conditions: {
    [key: string]: string
  }
  breakPoint: {
    [key: string]: MediaQueryList
  }
}
export function matchMedia (): BreakPoint {
  const obj: BreakPoint = {
    lg: 1024,
    md: 768,
    sm: 640,
    conditions: {},
    breakPoint: {}
  }

  // 条件リスト
  obj.conditions = {
    breakLg: `(max-width: ${obj.lg - 1}px)`,
    breakMd: `(max-width: ${obj.md - 1}px)`,
    breakSm: `(max-width: ${obj.sm - 1}px)`,
    overSm: `(min-width: ${obj.sm}px)`,
    overMd: `(min-width: ${obj.md}px)`,
    overLg: `(min-width: ${obj.lg}px)`,
    landscape: '(orientation: landscape)',
    portrait: '(orientation: portrait)'
  }

  // matchMediaを定義
  obj.breakPoint = {
    breakLg: window.matchMedia(obj.conditions.breakLg),
    breakMd: window.matchMedia(obj.conditions.breakMd),
    breakSm: window.matchMedia(obj.conditions.breakSm),
    overSm: window.matchMedia(obj.conditions.overSm),
    overMd: window.matchMedia(obj.conditions.overMd),
    overLg: window.matchMedia(obj.conditions.overLg),
    landscape: window.matchMedia(obj.conditions.landscape),
    portrait: window.matchMedia(obj.conditions.portrait)
  }

  return obj
}

/**
 * ブレークポイントを判断
 * @return {boolean} true or false
 */
export function isMedia (mediaName: string) {
  const media = matchMedia()
  if (media.breakPoint[mediaName]) {
    return media.breakPoint[mediaName].matches
  } else {
    return false
  }
}

/**
 * カレントURLの取得
 * @return {String} カレントURL
 */
export function getCuurentUrl () {
  return window.location.href.replace(window.location.protocol + '//' + window.location.host, '').replace(/\/+/g, '/')
}

/**
 * ステート管理用
 */
export const state = {
  cuurentUrl: getCuurentUrl(), // カレントURL
  scrollPosition: 0, // スクロール位置
  scrollDirection: null // スクロール方向
}

/**
 * HTMLエスケープ
 */
export function escapeHtml (str:string) {
  str = str.replace(/&/g, '&amp;')
  str = str.replace(/</g, '&lt;')
  str = str.replace(/>/g, '&gt;')
  str = str.replace(/"/g, '&quot;')
  str = str.replace(/'/g, '&#39;')
  return str
}

/**
 * スタイルシートを動的に追加するためのlink要素を生成
 * @param {string} href href
 */
export function createLinkStyleSheet (href:string) {
  const link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('href', href)
  document.getElementsByTagName('head')[0].appendChild(link)
}

/**
 * scriptを動的に追加するためのscript要素を生成
 * @param {string} href href
 */
export function createScriptElement (href:string) {
  const script = document.createElement('script')
  script.src = href
  document.getElementsByTagName('head')[0].appendChild(script)
}
