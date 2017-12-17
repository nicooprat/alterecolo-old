import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import store from '../store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/:category',
      name: 'Category',
      component: Home
    }
  ]
})

router.afterEach(function(to, from, next) {
  store.state.expandeds.length && store.commit('collapseAll')
})

export default router
