
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import components from './components'
// Vue.use(components);
import ElementUI from 'element-ui'
// 导入自定义组件
import components from './components'
// 导入自定义插件
import plugin from './plugin'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/icon/iconfont.css' // 图标
import 'babel-polyfill'
import axios from 'axios'
Vue.use(plugin)
Vue.use(ElementUI)
Vue.use(components)
Vue.config.productionTip = false
function getServerConfig() {
  return new Promise((resolve, reject) => {
    axios.get('./config.json').then(result => {
      const config = result.data
      for (const key in config) {
        Vue.prototype[key] = config[key]
      }
      resolve()
    })
  })
}
async function main() {
  await getServerConfig()
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}
main()
