<template>
  <main class="home">
    <p class="intro">On souhaite tous <strong>améliorer nos habitudes</strong>, consommer de façon <strong>éthique</strong>, remplacer nos <strong>produits polluants</strong>, réduire nos <strong>déchets</strong>... Mais il est parfois difficile d'y voir clair. Voici une <strong>liste participative</strong> des alternatives proposées par d'autres personnes comme vous...! <a href="https://bit.ly/AlterEcolo-proposer">Proposer une alternative</a></p>

    <nav v-if="this.items.length" class="filters">
      <router-link class="filter" :to="{name: 'Home'}">
        <strong class="name">Toutes</strong>
        <span class="count">{{this.items.length}}</span>
      </router-link>
      <router-link class="filter" v-for="category in categories" :to="{name: 'Category', params: {category: category.slug}}">
        <strong class="name">{{category.name}}</strong>
        <span class="count">{{category.count}}</span>
      </router-link>
    </nav>

    <transition-group class="list" v-if="getItems" tag="ul" appear name="fade">
      <Item v-for="item in getItems" :item="item" :key="item.id"/>
    </transition-group>
  </main>
</template>

<script>
  import Airtable from 'airtable'
  import Item from '@/components/Item'

  const base = new Airtable({apiKey: 'keycOP14E2tfhJ9fI'}).base('appI12batrjUkkAdC')

  export default {
    name: 'Home',
    components: {
      Item
    },
    data() {
      return {
        items: [],
        categories: [],
      }
    },
    computed: {
      getItems() {
        // Get items and their state
        const items = this.items.map(item => {
          return {
            ...item,
            checked: this.$store.state.checkeds.includes(item.id),
            expanded: this.$store.state.expandeds.includes(item.id),
          }
        })
        // Home: all
        if (this.$route.name === 'Home') return items
        // Category: filtered
        const category = this.categories.filter((cat) => cat.slug === this.$route.params.category)[0]
        return category && items.filter((item) => item.Catégorie.includes(category.name))
      }
    },
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
            id: item.id,
            cover: item.fields.Photo && item.fields.Photo[0], // Easier access
            expanded: false, // Toggle visibility, must be declared to be reactive
            checked: false, // Toggle checked, must be declared to be reactive
            categories: [],
            ...item.fields,
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
        err && console.error(err)
      })
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

    a {
      color: $green;
      text-decoration: none;
      border-bottom: 2px solid;
      font-weight: bold;
    }
  }

  .filters {
    margin: 5vh 0;
  }

  .filter {
    display: inline-block;
    margin-right: 1em;
    margin-bottom: .5em;
    text-decoration: none;
    border-bottom: 2px solid transparent;

    &.router-link-exact-active {
      border-bottom-color: currentColor;
    }
  }

  .count {
    opacity: .5;
    margin-left: .25em;
    font-size: .8em;
    font-weight: bold;
  }

  .list {
    list-style: none;
    padding-left: 0;
    margin-bottom: 5vh;
  }
</style>
