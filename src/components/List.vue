<template>
  <main>
    <form class="filters">
      <nav class="categories">
        <router-link class="category" v-for="category in categories" :key="category.slug" :to="{name: 'Category', params: {category: category.slug}}">
          <strong class="name">{{category.name}}</strong>
          <span class="count">{{category.count}}</span>
        </router-link>
        <router-link class="category category--all" :to="{name: 'Home'}">
          <strong class="name">Toutes</strong>
          <span class="count">{{items.length}}</span>
        </router-link>
      </nav>

      <vue-fuse
        placeholder="Rechercher..."
        tabindex="1"
        :search="$store.state.route.query.search"
        :value="$store.state.route.query.search"
        class="search"
        :keys="['Alternative', 'Remplacé', 'Description']"
        :list="items"
        eventName="searchItems"
        inputChangeEventName="searchChanged"
        :defaultAll="false"
        :shouldSort="true"
        :threshold="0.3"
        :includeScore="true"
        @esc="$route.query.search = ''"/>

      <nav class="sorts">
        <label class="sort">
          <input type="radio" name="sort" id="default" :checked="isSort('')" v-on:change="sort('')">
          <span>Par défaut</span>
        </label>
        <label class="sort">
          <input type="radio" name="sort" id="date" :checked="isSort('date')" v-on:change="sort('date')">
          <span>Récentes</span>
        </label>
        <label class="sort">
          <input type="radio" name="sort" id="difficulty" :checked="isSort('difficulty')" v-on:change="sort('difficulty')">
          <span>Faciles</span>
        </label>
      </nav>
    </form>

    <ul class="list" v-if="getItems && getItems.length">
      <Item v-for="item in getItems" :item="item" :key="item.id"/>
    </ul>
    <p class="empty" v-else>
      <strong>🍃</strong>
      <span>Aucune alternative trouvée...</span>
      <a class="propose" href="https://bit.ly/AlterEcolo-proposer">Proposer une alternative</a>
    </p>
  </main>
</template>

<script>
  import Item from '@/components/Item'

  export default {
    name: 'List',
    components: {
      Item,
    },
    props: ['items', 'categories'],
    data() {
      return {
        searchedItems: [],
      }
    },
    computed: {
      getItems() {
        // Copy items
        let items = this.items
        // Filter if search
        if (this.$store.state.route.query.search) {
          items = this.searchedItems.map(item => {
            return {
              ...item.item,
              score: item.score
            }
          })
        }
        // Sort
        switch (this.$store.state.route.query.sort) {
          case 'difficulty':
            items = items.sort((a, b) => a.Difficulté > b.Difficulté ? 1 : -1)
            break
          case 'date':
            items = items.sort((a, b) => a.createdTime > b.createdTime ? -1 : 1)
            break
          default:
            if (this.$store.state.search) items = items.sort((a, b) => a.score > b.score ? 1 : -1)
            break
        }
        // Category: filtered
        if (this.$route.name === 'Category') {
          const category = this.categories.filter((cat) => cat.slug === this.$route.params.category)[0]
          items = category && items.filter((item) => item.Catégorie.includes(category.name))
        }
        // Get items
        return items
      }
    },
    created() {},
    mounted() {
      // Update Disqus comments counts
      /* global DISQUSWIDGETS */
      DISQUSWIDGETS && DISQUSWIDGETS.getCount({reset: true})

      // Get search term from URL
      // Todo: https://github.com/shayneo/vue-fuse/issues/18
      const input = this.$el.querySelector('[type="search"]')
      const search = this.$router.currentRoute.query.search
      if (input && search) input.value = search

      // Catch search events
      this.$on('searchItems', results => {
        this.searchedItems = results
      })
      this.$on('searchChanged', search => {
        this.$router.replace({
          query: {
            ...this.$router.currentRoute.query,
            search: search || undefined
          }
        })
      })

      // Trigger search on page load
      this.$search(this.$router.currentRoute.query.search, this.items, {
        list: this.items,
        keys: ['Alternative', 'Remplacé', 'Description'],
        eventName: 'searchItems',
        defaultAll: false,
        shouldSort: true,
        threshold: 0.3,
        includeScore: true
      }).then(results => {
        this.searchedItems = results
      })
    },
    methods: {
      sort(sort) {
        this.$router.replace({
          query: {
            ...this.$router.currentRoute.query,
            sort: sort || undefined
          }
        })
      },
      isSort(sort) {
        // Default sort
        if (!sort && !this.$store.state.route.query.sort) return true
        // Match sort
        return this.$store.state.route.query.sort === sort
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

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

  .sorts {
    display: flex;
    align-items: center;
  }

  .sort {
    margin-left: 1em;
    cursor: pointer;

    input {
      position: absolute;
      visibility: hidden;

      &:checked ~ span {
        opacity: 1;
      }
    }

    span {
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: .05em;
      font-size: .75em;
      opacity: .5;
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
    margin-top: 0;
    margin-bottom: 5vh;
    background-color: rgba($green,.05);
    padding: 1em;
    border-radius: 3px;

    strong {
      float: left;
      font-size: 2.1em;
      margin-right: .35em;
    }

    span {
      display: block;
      color: mix($green,black,50);
      opacity: .5;
      font-size: .9em;
    }
  }
</style>
