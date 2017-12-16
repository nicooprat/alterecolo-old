import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    checkeds: [],
    score: 0
  },
  mutations: {
    toggleItem (state, {item}) {
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
    }
  }
})
