/*
```
<details class="c-details">
  <summary class="c-details__summary"> 開閉ボタン（summary）</summary>
  <div class="c-details__content">
    <p>あいうえお</p>

    <ul>
      <li><a href="/">リンク要素</a></li>
    </ul>
  </div>
</details>
```
*/

export const detailsUi = (detailsNodes, contentSelectorName = '.c-details__content') => {
  const calcHeight = (details, summary, detailsContent) => {
    return !details.open ? summary.scrollHeight : summary.scrollHeight + detailsContent.scrollHeight
  }

  if (detailsNodes.length) {
    detailsNodes.forEach((details) => {
      const summary = details.querySelector('summary')
      const detailsContent = details.querySelector(contentSelectorName)
      details.style.willChange = 'height'
      details.style.transition = 'height 0.4s ease-in-out'

      summary.addEventListener('click', (event) => {
        event.preventDefault()

        // クリック時の初期値設定
        details.style.height = `${calcHeight(details, summary, detailsContent)}px`

        // opne
        details.open = !details.open

        // その後の値設定
        details.style.height = `${calcHeight(details, summary, detailsContent)}px`

        // アニメーション終了時にautoに
        details.ontransitionend = (event) => {
          if (event.propertyName === 'height') details.style.removeProperty('height')
        }
      })
    })
  }
}
