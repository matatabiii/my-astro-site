/**
 * マウスオーバー / アウト
 */
export class Mouseenter {
  constructor(targetSelector, callback) {
    this.target = targetSelector
    this.callback = callback
    this.eventName = 'mouseenter'
  }

  init() {
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
  constructor(targetSelector, callback) {
    this.target = targetSelector
    this.callback = callback
    this.eventName = 'mouseleave'
  }

  init() {
    const eventName = this.eventName
    const onmouseleaveElements = document.querySelectorAll(this.target)

    const handleMouseleave = this.callback

    onmouseleaveElements.forEach((onmouseleaveElement) => {
      onmouseleaveElement.addEventListener(eventName, handleMouseleave, false)
    })
  }
}
