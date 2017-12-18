<template>
  <main class="home">
    <p class="intro">On souhaite tous <strong>améliorer nos habitudes</strong>, consommer de façon <strong>éthique</strong>, remplacer nos <strong>produits polluants</strong>, réduire nos <strong>déchets</strong>... Mais il est parfois difficile d'y voir clair. Voici une <strong>liste participative</strong> des alternatives proposées par d'autres personnes comme vous...! <a class="propose" href="https://bit.ly/AlterEcolo-proposer">Proposer une alternative</a></p>

    <template v-if="datasLoaded">
      <List :items="items" :categories="categories" v-if="$route.name !== 'Details'"/>
      <Details :item="getItem($route.params.id)" v-if="$route.name === 'Details'"/>
    </template>
  </main>
</template>

<script>
  import Airtable from 'airtable'
  import bugsnag from '@/config/errors'
  import List from '@/components/List'
  import Details from '@/components/Details'

  const base = new Airtable({apiKey: 'keycOP14E2tfhJ9fI'}).base('appI12batrjUkkAdC')

  export default {
    name: 'Home',
    components: {
      List,
      Details
    },
    data() {
      return {
        items: [],
        categories: [],
        datasLoaded: false,
      }
    },
    computed: {},
    created() {
      // Empty items
      this.items = []
      // Fetch new items
      base('Alternatives').select({
        filterByFormula: '{Validé} = 1' // Only manually validated items
      }).eachPage((items, fetchNextPage) => {
        // Load items in component
        this.items.push(...items.map((item) => {
          const newItem = {
            ...item.fields,
            id: item.id,
            slug: item.fields.Alternative.normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ').join('-').toLowerCase(),
            createdTime: item._rawJson.createdTime,
            cover: item.fields.Photo && item.fields.Photo[0], // Easier access
            expanded: false, // Toggle visibility, must be declared to be reactive
            checked: false, // Toggle checked, must be declared to be reactive
            categories: [],
          }
          // Push item categories
          item.fields.Catégorie.forEach((category) => {
            const slug = category.normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ').join('-').toLowerCase()
            const existingCategory = this.categories.filter((c) => c.slug === slug)[0]
            // Push normalized categories in newItem
            const cat = {
              name: category,
              count: 1,
              slug
            }
            newItem.categories.push(cat)
            // Reduce global categories
            if (!existingCategory) {
              this.categories.push(cat)
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
        this.datasLoaded = true
        err && bugsnag.notify(new Error(err))
      })
    },
    mounted() {
      // Get search term from URL
      // Todo: https://github.com/shayneo/vue-fuse/issues/18
      const input = this.$el.querySelector('[type="search"]')
      if (input) input.value = this.$router.currentRoute.query.search
      // Catch search events
      this.$on('searchItems', results => this.getResults(results))
    },
    methods: {
      getItem(id) {
        return this.items.filter(item => item.id === id)[0] || false
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  .home {
    min-height: 100vh;
  }

  .intro {
    opacity: .75;
    margin: 2vh 0 5vh;
  }

  .propose {
    color: $green;
    text-decoration: none;
    border-bottom: 2px solid;
    font-weight: bold;
  }
</style>
