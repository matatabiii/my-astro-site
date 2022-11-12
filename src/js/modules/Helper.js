/**
 * [WordPress]CF7の送信イベント処理を補助
 * @param {HtmlSelector} targetSelector ターゲットセレクター
 *
 * use
 * helperCF7('[data-form="cf7"]')
 */
export function helperCF7 (targetSelector) {
  if (document.querySelector(targetSelector)) {
    const formsCf7 = document.querySelectorAll(targetSelector)

    const cfIsChecked = (checkElement, checkWrapper, submit, $submitBtn) => {
      if (checkElement.checked) {
        checkWrapper.classList.remove('is-desabled')
        submit.classList.remove('is-desabled')
        $submitBtn.removeAttribute('disabled')
      } else {
        checkWrapper.classList.add('is-desabled')
        submit.classList.add('is-desabled')
        $submitBtn.setAttribute('disabled', 'disabled')
      }
    }

    formsCf7.forEach((formCf7) => {
      const checkWrapper = formCf7.querySelector('[data-cf-agree="check"]')
      const check = checkWrapper.querySelector('[data-cf-agree="check"] input[type="checkbox"]')
      const submit = formCf7.querySelector('[data-cf-agree="submit"]')
      const $submitBtn = submit.querySelector('[type="submit"]')

      check.addEventListener('change', (e) => {
        cfIsChecked(e.currentTarget, checkWrapper, submit, $submitBtn)
      })

      cfIsChecked(check, checkWrapper, submit, $submitBtn)
    })
  }
}

/**
 * inputへの入力値を対象のid要素に反映させる
 * @param {NodeElement} element input
 * @return {void}
 *
 * use
  ```
  const inputKeybindCopyTextSelector = '[data-inputCopyText]'
  if (document.querySelector(inputKeybindCopyTextSelector)) {
    inputKeybindCopyText(document.querySelector(inputKeybindCopyTextSelector))
  }
  ```
 */
export function inputKeybindCopyText (element) {
  const input = element
  const logElement = document.getElementById(input.dataset.inputcopytext)

  const updateValue = function updateValue (event) {
    logElement.textContent = event.target.value
  }

  if (input.tagName !== 'INPUT') {
    const childInput = input.querySelector('input')
    childInput.addEventListener('input', updateValue) // 初期値設定
    logElement.textContent = childInput.value
  } else {
    input.addEventListener('input', updateValue) // 初期値設定
    logElement.textContent = input.value
  }
}

/**
 * use
 * autoToHalfWidthNum()
 */
export function autoToHalfWidthNum (selector = '[data-toHarfNum]') {
  if (!document.querySelector(selector)) return

  document.querySelectorAll(selector).forEach((idElement) => {
    const id = idElement.dataset.toharfnum

    document.getElementById(id).addEventListener('blur', (e) => {
      const value = e.currentTarget.value

      e.currentTarget.value = value
        .replace(/[０-９]/g, function (s) {
          return String.fromCharCode(s.charCodeAt(0) - 0xfee0)
        })
        .replace(/[^\d]/g, '')
    })
  })
}

/**
 * use
 * formBeforeunload()
 */
export function formBeforeunload (selector = '[data-form] form') {
  if (!document.querySelector(selector)) return

  const formElement = document.querySelector(selector)

  let isSetHandler = false

  const onBeforeunloadHandler = (event) => {
    event.preventDefault()
    event.returnValue = ''
  }

  formElement.querySelectorAll('input, select, textarea').forEach((formItem) => {
    formItem.addEventListener('change', (e) => {
      if (!isSetHandler) {
        // console.log(isSetHandler)
        window.addEventListener('beforeunload', onBeforeunloadHandler, false)
        isSetHandler = true
      }
    })
  })

  formElement.addEventListener('submit', () => {
    window.removeEventListener('beforeunload', onBeforeunloadHandler, false)
  })
}

/**
 * マウスオーバー / アウト
 */
export class Mouseenter {
  constructor (targetSelector, callback) {
    this.target = targetSelector
    this.callback = callback
    this.eventName = 'mouseenter'
  }

  init () {
    const eventName = this.eventName
    const onmouseenterElements = document.querySelectorAll(this.target)

    const handleMouseenter = this.callback

    onmouseenterElements.forEach((onmouseenterElement) => {
      if (onmouseenterElement.classList.contains('js-onmouseenter')) {
        onmouseenterElement.classList.remove('js-onmouseenter')
      }

      onmouseenterElement.addEventListener(eventName, handleMouseenter, false)
    })
  }
}

export class Mouseleave {
  constructor (targetSelector, callback) {
    this.target = targetSelector
    this.callback = callback
    this.eventName = 'mouseleave'
  }

  init () {
    const eventName = this.eventName
    const onmouseleaveElements = document.querySelectorAll(this.target)

    const handleMouseleave = this.callback

    onmouseleaveElements.forEach((onmouseleaveElement) => {
      onmouseleaveElement.addEventListener(eventName, handleMouseleave, false)
    })
  }
}
