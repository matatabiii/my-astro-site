// const detailsNodes = document.querySelectorAll('details')

// const calcHeight = (details, summary, detailsContent) => {
//   return !details.open ? summary.scrollHeight : summary.scrollHeight + detailsContent.scrollHeight
// }

// if (detailsNodes.length) {
//   detailsNodes.forEach((details) => {
//     const summary = details.querySelector('summary')
//     const detailsContent = details.querySelector('.c-details__content')

//     summary.addEventListener('click', (event) => {
//       event.preventDefault()

//       // クリック時の初期値設定
//       details.style.height = `${calcHeight(details, summary, detailsContent)}px`

//       // opne
//       details.open = !details.open

//       // その後の値設定
//       details.style.height = `${calcHeight(details, summary, detailsContent)}px`

//       // アニメーション終了時にautoに
//       details.ontransitionend = (event) => {
//         if (event.propertyName === 'height') details.style.height = ''
//       }

//       details.open ? details.classList.add('is-open') : details.classList.remove('is-open')
//     })
//   })
// }
