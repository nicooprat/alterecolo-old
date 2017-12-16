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
  getters: {
    checkeds: state => state.checkeds,
    score: state => state.score,
  },
  mutations: {
    toggleItem (state, {item}) {
      if (state.checkeds.includes(item.id)) {
        state.score -= item.Difficulté
        state.checkeds.splice(item.id, 1)
      } else {
        state.score += item.Difficulté
        state.checkeds.push(item.id)
      }
    }
  }
})
