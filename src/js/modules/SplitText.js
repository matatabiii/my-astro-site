/**
 * # 1文字づつspan化
 */
export class SplitText {
  constructor (props = {}) {
    this.props = props
    this.config = {}
  }

  init () {
    const { target } = this.props

    const textArray = target.innerHTML.split('')
    const textArrayLen = textArray.length

    if (textArrayLen > 0) {
      target.innerHTML = ''

      for (let i = 0; i < textArrayLen; i++) {
        if (textArray[i]) {
          target.innerHTML += '<span>' + textArray[i] + '</span>'
        }
      }

      target.classList.add('js-SplitText--set')
    }
  }
}
