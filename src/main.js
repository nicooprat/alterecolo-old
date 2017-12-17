import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import { sync } from 'vuex-router-sync'
import VueFuse from 'vue-fuse'
import bugsnag from './config/errors'
import VueAnalytics from 'vue-analytics'

sync(store, router) 

Vue.use(VueAnalytics, {id: 'UA-111346412-1'})
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
