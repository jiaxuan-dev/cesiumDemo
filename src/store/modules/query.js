const state = () => ({
  showResult: null,
  singleLayer: null,
  queryShow: false
})
// mutations
const mutations = {
  setShowResult(state, showResult) {
    state.showResult = showResult
  },

  setSingleLayer(state, singleLayer) {
    state.singleLayer = singleLayer
  },
  setQueryShow(state, queryShow) {
    state.queryShow = queryShow
  }
}
export default {
  namespaced: true,
  state,
  mutations
}
