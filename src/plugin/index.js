import api from '../api'

const install = Vue => {
  if (install.installed) return false
  // 添加到Vue的原型链上
  Object.defineProperties(Vue.prototype, {
    $api: {
      value: api
    }
  })

  install.installed = true
}

export default install
