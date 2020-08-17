import Vue from 'vue'
import Vuex from 'vuex'
import legend from './modules/legend'
import query from './modules/query'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    legend,
    query
  }
})
