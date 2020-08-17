
const state = () => ({
  legendTitle: '图例',
  legendData: [],
  legendModel: 'color'
})
// mutations
const mutations = {
  setLegendData(state, legendData) {
    state.legendData = legendData
  },

  setLegendModel(state, legendModel) {
    state.legendModel = legendModel
  },

  setlegendTitle(state, legendTitle) {
    state.legendTitle = legendTitle
  }
}
export default {
  namespaced: true,
  state,
  mutations
}
