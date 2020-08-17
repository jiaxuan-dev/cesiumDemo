/*
 * @Descripttion: 组件加载vue
 * @version: 1.0
 * @Author: hxl
 * @Date: 2020-04-14 16:50:26
 * @LastEditors: hxl
 * @LastEditTime: 2020-05-19 11:53:02
 */
import mapSwitch from './map-switch/mapSwitch.vue'
import mainToolbar from './main-toolbar/mainToolbar.vue'
import drawPanel from './draw-panel/drawPanel.vue'
import flyRoaming from './fly-roaming/flyRoaming.vue'
import mainView from './main-view/index.vue'
import dialogPage from './main-view/component/DialogPage.vue'
import specialSubject from './special-subject/specialSubject.vue'
import statisticsCharts from './statistics-charts/statisticsCharts.vue'
import themeChange from './theme-change/themeChange.vue'
/**
 * Register all Vue components.
 * @param {Object} Vue
 * @param {Object} options
 */
function plugin(Vue, options = {}) {
  if (plugin.installed) {
    return
  }
  plugin.installed = true
  Vue.component(mainToolbar.name, mainToolbar)
  Vue.component(mapSwitch.name, mapSwitch)
  Vue.component(drawPanel.name, drawPanel)
  Vue.component(flyRoaming.name, flyRoaming)
  Vue.component(mainView.name, mainView)
  Vue.component(dialogPage.name, dialogPage)
  Vue.component(specialSubject.name, specialSubject)
  Vue.component(statisticsCharts.name, statisticsCharts)
  Vue.component(themeChange.name, themeChange)
}

export default plugin
