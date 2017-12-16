<template>
  <main class="home">
    <p class="intro">On souhaite tous <strong>améliorer nos habitudes</strong>, consommer <strong>éthique</strong>, remplacer nos <strong>produits polluants</strong>, réduire nos <strong>déchets</strong>... Mais il est parfois difficile d'y voir claire. Voici une <strong>liste participative</strong> des alternatives proposées par d'autres personnes comme vous...!</p>

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

    <ul class="list" v-if="getItems">
      <li class="item" v-for="item in getItems">
        <img class="cover" v-if="item.cover" :src="item.cover.thumbnails.large.url" :alt="item.Alternative" :width="item.cover.thumbnails.large.width" :height="item.cover.thumbnails.large.height">
        <span class="cover" v-else></span>
        <span v-if="item.Difficulté" class="difficulty">
          <svg v-for="n in 3" :class="{off: item.Difficulté < n}" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
        </span>
        <small class="subtitle">{{item.Remplacé}}</small>
        <strong class="title">{{item.Alternative}}</strong>
        <nav class="links" v-if="item.Catégorie">
          <a class="category" href="#" v-for="category in item.Catégorie">{{category}}</a>          
          <a class="source" v-if="item.Lien" :href="item.Lien">
            Source
            <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"/></svg>
          </a>
          <a class="expand" v-if="item.Lien" href="#" v-on:click.prevent="expand(item.id)">
            <span v-if="item.expanded">
              Moins d'infos
              <svg width="24" height="24" viewBox="0 0 24 24"><path transform="rotate(270) translate(-24,0)" fill="currentColor" d="M8.122 24l-4.122-4 8-8-8-8 4.122-4 11.878 12z"/></svg>
            </span>
            <span v-else>
              Plus d'infos
              <svg width="24" height="24" viewBox="0 0 24 24"><path transform="rotate(90) translate(0,-24)" fill="currentColor" d="M8.122 24l-4.122-4 8-8-8-8 4.122-4 11.878 12z"/></svg>
            </span>
          </a>
        </nav>
        <span v-show="item.expanded" class="desc">{{item.Description}}</span>
      </li>
    </ul>
  </main>
</template>

<script>
  import Airtable from 'airtable'
  const base = new Airtable({apiKey: 'keycOP14E2tfhJ9fI'}).base('appI12batrjUkkAdC')

  export default {
    name: 'Home',
    data() {
      return {
        items: [],
        categories: [],
      }
    },
    computed: {
      getItems() {
        // Home: all
        if (this.$route.name === 'Home') return this.items
        // Category: filtered
        const category = this.categories.filter((cat) => cat.slug === this.$route.params.category)[0]
        return category && this.items.filter((item) => item.Catégorie.includes(category.name))
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        // Empty items
        this.items = []
        // Fetch new items
        base('Alternatives').select({
          filterByFormula: '{Validé} = 1' // Only manually validated items
        }).eachPage((items, fetchNextPage) => {
          // Load items in component
          this.items.push(...items.map((item) => {
            // Push item categories
            item.fields.Catégorie.forEach((category) => {
              const slug = category.normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ').join('-').toLowerCase()
              const existingCategory = this.categories.filter((c) => c.slug === slug)[0]
              if (!existingCategory) {
                this.categories.push({
                  name: category,
                  count: 1,
                  slug
                })
              } else {
                existingCategory.count = existingCategory.count + 1
              }
            })
            // Push item itself
            return {
              id: item.id,
              cover: item.fields.Photo && item.fields.Photo[0], // Easier access
              expanded: false, // Toggle visibility, must be declared to be reactive
              ...item.fields,
            }
          }))
          // Load all datas
          fetchNextPage()
        }, (err) => {
          err && console.error(err)
        })
      },
      expand(id) {
        const target = this.items.filter((item) => item.id === id)[0]
        target.expanded = !target.expanded
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

  .filters {
    margin: 5vh 0;
  }

  .filter {
    display: inline-block;
    margin-right: 1em;
    margin-bottom: 1em;
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
  
  .item {
    display: block;
    box-shadow: 0 0 0 1px rgba(black,.05), 0 1px 2px rgba(black,.1);
    border-radius: 3px;
    margin-bottom: 2em;
    padding: 1em;
    padding-left: 7.5em;
    position: relative;
    overflow: hidden;
  }

  .cover {
    float: left;
    width: 6.5em; height: 6.5em;
    object-fit: cover;
    margin: -1em 0 -1em -7.5em;
    border: 3px solid white;
    border-radius: 5px;
    overflow: hidden;
    background-color: rgba(black,.03);
  }

  .difficulty {
    float: right;
    
    svg {
      display: inline-block;
      width: 1em; height: 1em;
      margin-left: .5em;
      color: gold;
      stroke: currentColor;
      stroke-width: 2px;
      overflow: visible;

      &.off {
        color: rgba(black,.1);

        path {
          fill: none;
        }
      }
    }
  }
  
  .subtitle {
    display: block;
    font-size: 1em;
    opacity: .75;
  }

  .title {
    display: block;
    font-size: 1.25em;
  }

  .links {
    font-size: .9em;
    margin-top: .5em;

    > a {
      display: inline-flex;
      align-items: center;
      margin-right: 1em;
      text-decoration: none;

      svg {
        width: 0.7em; height: 0.7em;
        margin-left: .25em;
      }
    }
  }

  .category {
    font-weight: bold;
    border-bottom-width: 2px !important;
  }

  .desc {
    display: block;
    margin: -1em;
    margin-top: 1em;
    margin-left: -7.5em;
    padding: 1em;
    position: relative;
    z-index: 1;
    clear: left;
  }
</style>
