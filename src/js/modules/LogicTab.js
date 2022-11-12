/**
 * TabUI - タブ切り替え
 *
 * □機能
 * ・WAI-AREAに対応
 * ・セレクトボックスでの切り替えに対応（タブが多めの時にスマホで便利）
 * ・タブでの切り替え（当たり前）
 *
 * □使い方
 * data-logic="tab-select" は 必要であれば
 * button は aタグ でも可（その場合 data-logic-href は href に変更 type="button" は削除）
 *
 <div data-logic="tab-root">
  <select data-logic="tab-select">
    <option label="タブ A" value="#a">タブ A</option>
    <option label="タブ B" value="#b">タブ B</option>
    <option label="タブ C" value="#c">タブ C</option>
    <option label="タブ D" value="#d">タブ D</option>
  </select>

  <ul data-logic="tab-tablist" aria-label="タブ">
    <li role="none presentation">
      <button data-logic="tab" data-logic-href="#a" id="tab-a" type="button">タブ A</button>
    </li>
    <li role="none presentation">
      <button data-logic="tab" data-logic-href="#b" id="tab-b" type="button" class="is-active">タブ B</button>
    </li>
    <li role="none presentation">
      <button data-logic="tab" data-logic-href="#c" id="tab-c" type="button">タブ C</button>
    </li>
    <li role="none presentation">
      <button data-logic="tab" data-logic-href="#d" id="tab-d" type="button">タブ D</button>
    </li>
  </ul>

  <div data-logic="contents">
    <div data-logic="tab-panel" id="a">
      <div>
        <p>
          吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。吾輩はここで始めて人間というものを見た。しかもあとで聞くとそれは書生という人間中で一番獰悪な種族であったそうだ。この書生というのは時々我々を捕えて煮て食うという話である。しかしその当時は何という考もなかったから別段恐しいとも思わなかった。ただ彼の掌に載せられてスーと持ち上げられた時何だかフワフワした感じがあったばかりである。掌の上で少し落ちついて書生の顔を見たのがいわゆる人間というものの見始であろう。この時妙なものだと思った感じが今でも残っている。第一毛をもって装飾されべきはずの顔がつるつるしてまるで薬缶だ。その後猫にもだいぶ逢ったがこんな片輪には一度も出会わした事がない。のみならず顔の真中があまりに突起している。そうしてその穴の中から時々ぷうぷうと煙を
        </p>
      </div>
    </div>
    <div data-logic="tab-panel" id="b">タブパネル B</div>
    <div data-logic="tab-panel" id="c">タブパネル C</div>
    <div data-logic="tab-panel" id="d">タブパネル D</div>
  </div>
</div>
*/
export class LogicTab {
  /**
   * constructor
   * @param {element} targetSelector
   */
  constructor (targetSelector) {
    this.onInit = false
    this.target = targetSelector
  }

  /**
   * 初期化
   */
  init () {
    if (!document.querySelector(this.target)) return false

    this.onInit = true

    this.el = {
      $tabRoot: document.querySelectorAll(this.target),
      dataTabList: '[data-logic="tab-tablist"]',
      dataSelect: '[data-logic="tab-select"]',
      dataTabs: '[data-logic="tab"]'
    }

    this.dataHref = 'data-logic-href'

    for (const key of Object.keys(this.el.$tabRoot)) {
      const $tabRoot = this.el.$tabRoot[key]
      const $tabList = $tabRoot.querySelector(this.el.dataTabList)
      const $select = $tabRoot.querySelector(this.el.dataSelect)
      const $tabs = $tabRoot.querySelectorAll(this.el.dataTabs)
      const $tabLists = $tabRoot.querySelectorAll(this.el.dataTabList)
      const tabLengthRaw = $tabs.length
      const tabLength = tabLengthRaw

      let selectedValue = null

      // WAI-ARIA
      $tabList.setAttribute('role', 'tablist')

      if ($tabLists.length > 1) {
        $tabLists[1].setAttribute('role', 'tablist')
      }

      for (const i of Object.keys($tabs)) {
        const $tab = $tabs[i]
        const $tabPanel = this.getTabPanel($tab)

        const tabId = $tab.getAttribute('id')
        const tabPanelId = $tabPanel.getAttribute('id')
        const selected = $tab.getAttribute('area-selected') === 'true' || $tab.classList.contains('is-active')

        // WAI-ARIA
        $tab.setAttribute('aria-controls', tabId)
        $tabPanel.setAttribute('aria-labelledby', tabPanelId)
        $tab.setAttribute('role', 'tab')
        $tab.setAttribute('tabindex', '0')
        $tabPanel.setAttribute('role', 'tabpanel')
        $tabPanel.setAttribute('tabindex', '0')
        $tabPanel.setAttribute('aria-hidden', 'true')

        // Click EVENT
        $tab.addEventListener(
          'click',
          (e) => {
            this.onClickTab(e, this)

            if ($tabLists.length > 1) {
              this.tabListSync(i, $tabs, tabLength)
            }
          },
          false
        )

        if (selected) {
          selectedValue = this.getTabPanelSelector($tab)

          this.changeStateShow($tab, $tabPanel)
        } else {
          this.changeStateHide($tab, $tabPanel)
        }
      }

      // セレクトボックスがある場合の初期動作
      if ($select) {
        if (selectedValue) $select.value = selectedValue
        $select.addEventListener(
          'change',
          (e) => {
            this.onChangeTab(e, this)
          },
          false
        )
      }
    }

    this.setDefaultTabForHash()
  }

  /**
   * タブリストが2つある場合のステート同期
   */
  tabListSync (index, $tabs, tabLength) {
    const numIndex = parseInt(index, 10)
    const isFirstTabsLists = numIndex + tabLength / 2 - tabLength < 0
    const realTabLength = tabLength / 2
    const i = isFirstTabsLists ? numIndex + realTabLength : numIndex - realTabLength
    // console.log(i)
    const $tab = $tabs[i]

    const $selectedTab = $tab
    const selected =
      $selectedTab.getAttribute('area-selected') === 'true' || $selectedTab.classList.contains('is-active')

    if (selected) return

    $tab.setAttribute('aria-selected', 'true')
    $tab.classList.add('is-active')
  }

  /**
   * 状態の切り替え：show
   */
  changeStateShow ($tab, $tabPanel, display) {
    $tab.setAttribute('aria-selected', 'true')
    $tab.classList.add('is-active')
    $tabPanel.setAttribute('aria-hidden', 'false')

    if (!display && display !== false) $tabPanel.style.display = 'inherit'
  }

  /**
   * 状態の切り替え：hide
   */
  changeStateHide ($tab, $tabPanel, display) {
    $tab.setAttribute('aria-selected', 'false')
    $tab.classList.remove('is-active')
    $tabPanel.setAttribute('aria-hidden', 'true')

    if (!display && display !== false) $tabPanel.style.display = 'none'
  }

  /**
   * クリックイベント
   */
  onClickTab (event, _self) {
    event.preventDefault()

    const $selectedTab = event.currentTarget
    const selected =
      $selectedTab.getAttribute('area-selected') === 'true' || $selectedTab.classList.contains('is-active')

    if (selected) return

    const $tabRoot = $selectedTab.closest(_self.target)
    const $selectedTabPanel = _self.getTabPanel($selectedTab)
    const $deselectedTabs = $tabRoot.querySelectorAll(_self.el.dataTabs)
    const deselectedTabsLength = $deselectedTabs.length

    for (let i = 0; i < deselectedTabsLength; i++) {
      const $deselectedTab = $deselectedTabs[i]
      const $deselectedTabPanel = _self.getTabPanel($deselectedTab)

      _self.changeStateHide($deselectedTab, $deselectedTabPanel)
    }

    _self.changeStateShow($selectedTab, $selectedTabPanel)

    if ($tabRoot.querySelector(_self.el.dataSelect)) {
      const $select = $tabRoot.querySelector(_self.el.dataSelect)
      $select.value = _self.getTabPanelSelector($selectedTab)
    }
  }

  onChangeTab (event, _self) {
    const $selectedSelect = event.currentTarget
    const href = $selectedSelect.value

    const $tabRoot = $selectedSelect.closest(_self.target)
    const $selectedTab = $tabRoot.querySelector('[data-logic-href="' + href + '"], [href="' + href + '"]')
    const $selectedTabPanel = _self.getTabPanel($selectedTab)
    const $deselectedTabs = $tabRoot.querySelectorAll(_self.el.dataTabs)
    const deselectedTabsLength = $deselectedTabs.length

    for (let i = 0; i < deselectedTabsLength; i++) {
      const $deselectedTab = $deselectedTabs[i]
      const $deselectedTabPanel = _self.getTabPanel($deselectedTab)

      _self.changeStateHide($deselectedTab, $deselectedTabPanel)
    }

    _self.changeStateShow($selectedTab, $selectedTabPanel)
  }

  /**
   * タブに対応するタブパネルを取得
   */
  getTabPanelSelector ($tab) {
    let selector = $tab.getAttribute(this.dataHref)

    if (!selector) selector = $tab.getAttribute('href')
    if (!selector) selector = $tab.value

    return selector
  }

  getTabPanel ($tab) {
    return document.querySelector(this.getTabPanelSelector($tab))
  }

  /**
   * URLを見てデフォルトタブを設定
   */
  setDefaultTabForHash () {
    const id = this.getParam('tab')
    // const hash = window.location.hash
    if (id) {
      // console.log(hash)
      const hashTargetTab = document.querySelector(`[data-logic-href="#${id}"]`)
      if (hashTargetTab) hashTargetTab.click()
    }
  }

  getParam (name, url) {
    if (!url) url = window.location.href
    name = name.replace(/[[\]]/g, '\\$&')
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
    const results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
  }
}
