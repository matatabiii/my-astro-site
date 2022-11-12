/**
 * # 動画の自動再生（主にメインビジュアルで使用）
 * @param {element} targetSelector
 */
export class AutoPlayVideo {
  constructor (videoElement) {
    this.videoElement = videoElement
    this.playedClass = this.videoElement.dataset.playedClass
    this.delay = this.videoElement.dataset.delay
    this.timer = this.delay ? parseInt(this.delay, 10) : 0
  }

  init () {
    if (!this.videoElement.muted) this.videoElement.muted = true
    this.videoElement.load()

    this.videoElement.addEventListener('loadeddata', (e) => {
      this.canPlay(e)
    }, false)
  }

  canPlay (e) {
    const $video = e.currentTarget

    if ($video.readyState >= 2) {
      setTimeout(() => {
        $video.play()
        document.documentElement.classList.add(this.playedClass)
      }, this.timer)
    }
  }
}
