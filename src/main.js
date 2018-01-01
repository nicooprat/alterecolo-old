import Vue from 'vue'
import App from '@/components/App'
import router from '@/config/router'
import store from '@/config/store'
import VueHead from 'vue-head'
import { sync } from 'vuex-router-sync'
import VueFuse from 'vue-fuse'
import VueAnalytics from 'vue-analytics'

sync(store, router)

Vue.use(VueFuse)
Vue.use(VueHead)
Vue.use(VueAnalytics, {
  id: 'UA-111346412-1',
  commands: {
    toggleCheck(itemId) {
      const action = store.state.checkeds.indexOf(itemId) >= 0 ? 'Check' : 'Uncheck'
      this.$ga.event('Action', action, 'id', itemId)
    }
  },
})

Vue.config.productionTip = false
Vue.config.performance = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
