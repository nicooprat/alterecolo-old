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
  debug: {
    enabled: true,
    trace: false,
    sendHitTask: true
  }
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
