import settings from './settings'

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueFuse from 'vue-fuse'
import bugsnag from 'bugsnag-js'
import bugsnagVue from 'bugsnag-vue'

const bugsnagClient = bugsnag(settings.bugsnag)
bugsnagClient.use(bugsnagVue(Vue))

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
