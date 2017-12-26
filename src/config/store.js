import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    checkeds: [],
    score: 0,
    items: [],
    categories: []
  },
  mutations: {
    setDatas(state, {items, categories}) {
      state.items = items
      state.categories = categories
    },
    toggleCheckItem (state, {item}) {
      // Already checked?
      const index = state.checkeds.indexOf(item.id)
      if (index === -1) {
        // Push
        Vue.$ga.event('Action', 'Check', 'id', item.id)
        state.score += item.Difficulté
        state.checkeds.push(item.id)
      } else {
        // Pull
        Vue.$ga.event('Action', 'Uncheck', 'id', item.id)
        state.score -= item.Difficulté
        state.checkeds.splice(index, 1)
      }
    },
  }
})
