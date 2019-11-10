async function setCheckState (selector, value) {
  const checkbox = await SpinQuery.select(() => document.querySelector(selector))
  if (!checkbox) {
    return
  }
  checkbox.checked = value
  raiseEvent(checkbox, 'change')
}
Observer.videoChange(() => {
  if (!settings.enableDanmaku) {
    setCheckState('.bilibili-player-video-danmaku-switch>input', false)
  }
  if (settings.rememberDanmakuSettings) {
    const selectors = {
      subtitlesPreserve: '.bilibili-player-video-danmaku-setting-left-preventshade input',
      smartMask: '.bilibili-player-video-danmaku-setting-left-danmaku-mask input'
    }
    async function applyDanmakuSettings () {
      const panel = await SpinQuery.select(() => document.querySelector('.bilibili-player-video-danmaku-setting'))
      if (!panel) {
        return
      }
      await loadLazyPanel('.bilibili-player-video-danmaku-setting')
      // bilibili will hides the panel after 200ms delay
      setTimeout(() => resources.removeStyle('defaultDanmakuSettingsStyle'), 300)

      for (const [type, value] of Object.entries(settings.danmakuSettings)) {
        const element = await SpinQuery.select(() => document.querySelector(selectors[type]))
        if (element !== null && element.checked !== undefined && element.checked !== value) {
          element.click()
        }
      }
    }
    async function listenDanmakuSettingsChange () {
      for (const type in settings.danmakuSettings) {
        const element = await SpinQuery.select(() => document.querySelector(selectors[type]))
        if (!element) {
          return
        }
        element.addEventListener('click', () => {
          settings.danmakuSettings = Object.assign(settings.danmakuSettings, {
            [type]: element.checked
          })
          // settings.danmakuSettings[type] = element.checked;
        })
      }
    }
    applyDanmakuSettings()
    listenDanmakuSettingsChange()
  }
})
