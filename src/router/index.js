import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || (to.hash && {selector: to.hash}) || {x: 0, y: 0}
  },
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/alternative/:slug/:id',
      name: 'Details',
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
  // Empty search input
  // Todo: https://github.com/shayneo/vue-fuse/issues/18
  if (to.path !== from.path) {
    const search = document.querySelector('[type="search"]')
    if (search) search.value = ''
  }
})

export default router
