import 'babel-polyfill'

import Vue from 'vue'
import App from '@/components/App'
import router from '@/config/router'
import store from '@/config/store'
import { sync } from 'vuex-router-sync'
import VueFuse from 'vue-fuse'
import VueAnalytics from 'vue-analytics'

sync(store, router)

Vue.use(VueAnalytics, {
  id: 'UA-111346412-1',
  commands: {
    toggleCheck(itemId) {
      const action = store.state.checkeds.includes(itemId) ? 'Check' : 'Uncheck'
      this.$ga.event('Action', action, 'id', itemId)
    }
  },
})
Vue.use(VueFuse)

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
