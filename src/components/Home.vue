<template>
  <main class="home">
    <p class="intro">On souhaite tous <strong>améliorer nos habitudes</strong>, consommer de façon <strong>éthique</strong>, remplacer nos <strong>produits polluants</strong>, réduire nos <strong>déchets</strong>... Mais il est parfois difficile d'y voir clair. Voici une <strong>liste participative</strong> des alternatives proposées par d'autres personnes comme vous...! <a class="propose" href="https://bit.ly/AlterEcolo-proposer">Proposer une alternative</a></p>

    <template v-if="this.items.length">
      <form class="filters">
        <nav class="categories">
          <router-link class="category" v-for="category in categories" :to="{name: 'Category', params: {category: category.slug}}">
            <strong class="name">{{category.name}}</strong>
            <span class="count">{{category.count}}</span>
          </router-link>
          <router-link class="category category--all" :to="{name: 'Home'}">
            <strong class="name">Toutes</strong>
            <span class="count">{{this.items.length}}</span>
          </router-link>
        </nav>

        <vue-fuse placeholder="Rechercher..." tabindex="1" :search="search" class="search" :keys="['Alternative', 'Remplacé', 'Description']" :list="items" eventName="searchItems" :defaultAll="false" :shouldSort="true" :threshold="0.3"/>
      </form>

      <ul class="list" v-if="getItems && getItems.length">
        <Item v-for="item in getItems" :item="item"/>
      </ul>
      <p class="empty" v-else>
        <strong>😕</strong>
        <span>Aucune alternative trouvée...</span>
        <a class="propose" href="https://bit.ly/AlterEcolo-proposer">Proposer une alternative</a>
      </p>
    </template>
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
        searchedItems: [],
      }
    },
    computed: {
      search() {
        const search = this.$store.state.search
        // Todo: https://github.com/shayneo/vue-fuse/issues/20
        const input = document.querySelector('[type="search"]')
        if (input) input.value = search
        return search
      },
      getItems() {
        let items = this.items
        // Filter if search
        if (this.$store.state.search) items = this.searchedItems
        // Get items and their state
        items = items.map(item => {
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

      // Search
      this.$on('searchItems', results => {
        this.searchedItems = results
        // Todo: https://github.com/shayneo/vue-fuse/issues/18
        const term = document.querySelector('[type="search"]').value
        this.$store.commit('search', {term})
        this.$router.replace({
          query: term && {
            search: term
          }
        })
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
  }

  .propose{
    color: $green;
    text-decoration: none;
    border-bottom: 2px solid;
    font-weight: bold;
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    margin: 5vh 0;
  }

  .categories {
    display: flex;
    flex-wrap: wrap;
    flex: 0 0 auto;
    align-items: center;
    width: 100%;
    margin-bottom: 1em;
  }

  .category {
    margin-right: 1em;
    margin-bottom: .5em;
    text-decoration: none;
    border-bottom: 2px solid transparent;

    &--all {
      order: -1;
    }

    &.router-link-active {
      border-bottom-color: currentColor;
    }

    &.router-link-active ~ &--all {
      border-bottom-color: transparent;
    }
  }

  .search {
    appearance: none;
    border: 1px solid rgba(black,.1);
    font: inherit;
    border-radius: 3px;
    font-size: .9em;
    padding: .35em .75em .4em;
    color: $text;

    &::placeholder {
      color: rgba($text,.35);
    }

    &:focus {
      border-color: rgba($blue,.5);
      outline: none;
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

  .empty {
    margin-bottom: 5vh;
    background-color: rgba(black,.03);
    padding: 1em;
    border-radius: 3px;

    strong {
      float: left;
      font-size: 2.1em;
      margin-right: .35em;
    }

    span {
      display: block;
      opacity: .5;
      font-size: .9em;
    }
  }
</style>
