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
        class="search"
        :search="$store.state.route.query.search"
        v-bind="searchOptions"/>

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

    <div class="results" v-if="$store.state.datasLoaded">
      <ul class="list" v-if="filteredItems && filteredItems.length">
        <Item v-for="item in filteredItems" :item="item" :key="item.id"/>
      </ul>
      <p class="empty" v-else>
        <strong>🍃</strong>
        <span>Aucune alternative trouvée...</span>
        <a class="propose" href="https://bit.ly/AlterEcolo-proposer">Proposer une alternative</a>
      </p>
    </div>

    <div class="loading" v-else>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </main>
</template>

<script>
  import Item from '@/components/Item'
  import VueFuse from '@/components/VueFuse'

  export default {
    name: 'List',
    components: {
      Item,
      VueFuse,
    },
    props: ['items', 'categories'],
    data() {
      return {
        searchedItems: [],
        searchOptions: {
          list: this.items,
          keys: ['Alternative', 'Remplacé', 'Description'],
          eventName: 'searchItems',
          inputChangeEventName: 'searchChanged',
          defaultAll: false,
          shouldSort: true,
          threshold: 0.3,
          includeScore: true,
        }
      }
    },
    computed: {
      filteredItems() {
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
          items = category && items.filter((item) => item.Catégorie.indexOf(category.name) >= 0)
        }
        // Get items
        return items
      }
    },
    created() {},
    mounted() {
      // Update Disqus comments counts
      /* global DISQUSWIDGETS */
      if (typeof(DISQUSWIDGETS) !== 'undefined') DISQUSWIDGETS.getCount({reset: true})

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
      this.$search(this.$router.currentRoute.query.search, this.items, this.searchOptions).then(results => {
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

  main {
    min-height: 100vh;
  }

  .loading {
    width: 100%;

    @media (min-width: $break) {
      padding-top: 6em;
    }

    > div {
      $w: 600px;
      height: 4em;
      margin-bottom: 2em;
      background-color: rgba(black,.03);
      background-image: linear-gradient(to right, rgba(black,0) 0, rgba(black,.03) $w/2, rgba(black,0) $w);
      background-repeat: no-repeat;
      background-size: $w 100%;
      animation: loading 1s infinite both;

      &:nth-child(1) {
        animation-delay: -100ms;
      }

      &:nth-child(2) {
        animation-delay: -50ms;
      }

      @keyframes loading{
        from { background-position: -$w 0 }
        to   { background-position: calc(100% + #{$w}) 0 }
      }

      @media (max-width: 520px) {
        margin: 0 -1em 1px;
      }
    }
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    margin: 5vh 0;

    @media(min-width: $break) {
      position: sticky;
      top: 2em;
      width: 20em;
      margin: 1em 0 1em -22em;
      float: left;
      clear: left;
    }
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
    width: 15em;
    appearance: none;
    border: 1px solid rgba(black,.1);
    font: inherit;
    border-radius: 3px;
    font-size: .9em;
    padding: .35em .75em .4em;
    color: $text;
    margin-right: auto;

    &::placeholder {
      color: rgba($text,.35);
    }

    &:focus {
      border-color: rgba($blue,.5);
      outline: none;
    }

    @media(min-width: $break) {
      width: 100%;
      margin-bottom: 1em;
    }

    @media(max-width: 520px) {
      width: 100%;
      margin-bottom: 1em;
    }
  }

  .sorts {
    display: flex;
    align-items: center;
  }

  .sort {
    margin-left: 1em;
    cursor: pointer;

    &:first-child {

      @media(min-width: $break) {
        margin-left: 0;
      }

      @media(max-width: 520px) {
        margin-left: 0;
      }
    }

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

  .results {
    width: 100%;

    @media(min-width: $break) {
      padding: 5px;
      padding-top: 3em;
      margin: 0 -5px 5vh;
      overflow: hidden;
    }
  }

  .list {
    width: 100%;
    list-style: none;
    padding-left: 0;
    margin-top: 0;
    margin-bottom: 5vh;
  }

  .empty {
    margin-top: 0;
    margin-bottom: 5vh;
    background-color: rgba($green,.05);
    padding: 1em;
    border-radius: 3px;

    a {
      color: $green;
      text-decoration: none;
      border-bottom: 2px solid;
      font-weight: bold;
    }

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
