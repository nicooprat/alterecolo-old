import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState({
    paths: ['checkeds', 'score']
  })],
  state: {
    checkeds: [],
    expandeds: [],
    score: 0,
  },
  mutations: {
    toggleCheckItem (state, {item}) {
      // Already checked?
      const index = state.checkeds.indexOf(item.id)
      if (index === -1) {
        // Push
        state.score += item.Difficulté
        state.checkeds.push(item.id)
      } else {
        // Pull
        state.score -= item.Difficulté
        state.checkeds.splice(index, 1)
      }
    },
    toggleExpandItem (state, {item}) {
      // Already checked?
      const index = state.expandeds.indexOf(item.id)
      if (index === -1) {
        // Push
        state.expandeds.push(item.id)
      } else {
        // Pull
        state.expandeds.splice(index, 1)
      }
    },
    collapseAll(state) {
      state.expandeds.splice(0, state.expandeds.length)
    }
  }
})
