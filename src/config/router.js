import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/List'
import Details from '@/components/Details'
import store from '@/config/store'
import Airtable from 'airtable'
import bugsnag from '@/config/errors'

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
      component: List,
      props(route) {
        return {
          items: store.state.items,
          categories: store.state.categories,
        }
      }
    },
    {
      path: '/alternative/:slug/:id',
      name: 'Details',
      component: Details,
      props(route) {
        const item = store.state.items.filter(item => item.id === route.params.id)
        return {
          key: item[0].id,
          item: item[0]
        }
      }
    },
    {
      path: '/:category',
      name: 'Category',
      component: List,
      props(route) {
        return {
          items: store.state.items,
          categories: store.state.categories,
        }
      }
    }
  ]
})

const items = []
const categories = []

router.onReady(function(to, from, next) {
  const base = new Airtable({apiKey: 'keycOP14E2tfhJ9fI'}).base('appI12batrjUkkAdC')
  // Fetch new items
  base('Alternatives').select({
    filterByFormula: '{Validé} = 1' // Only manually validated items
  }).eachPage((datas, fetchNextPage) => {
    // Load items in component
    items.push(...datas.map((item) => {
      const newItem = {
        ...item.fields,
        id: item.id,
        slug: item.fields.Alternative.normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ').join('-').toLowerCase(),
        createdTime: item._rawJson.createdTime,
        cover: item.fields.Photo && item.fields.Photo[0], // Easier access
        categories: [],
      }
      // Push item categories
      item.fields.Catégorie.forEach((category) => {
        const slug = category.normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ').join('-').toLowerCase()
        const existingCategory = categories.filter((c) => c.slug === slug)[0]
        // Push normalized categories in newItem
        const cat = {
          name: category,
          count: 1,
          slug
        }
        newItem.categories.push(cat)
        // Reduce global categories
        if (!existingCategory) {
          categories.push(cat)
        } else {
          existingCategory.count = existingCategory.count + 1
        }
      })
      // Push item itself
      return newItem
    }))
    // Load all datas
    fetchNextPage()
  }, (err) => {
    store.commit('setDatas', {items, categories})
    err && bugsnag.notify(new Error(err))
  })
})

export default router
