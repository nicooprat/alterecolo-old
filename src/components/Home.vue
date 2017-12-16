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

    <ul class="list" v-if="getItems">
      <li class="item" v-for="item in getItems">
        <img class="cover" v-if="item.cover" :src="item.cover.thumbnails.large.url" :alt="item.Alternative" :width="item.cover.thumbnails.large.width" :height="item.cover.thumbnails.large.height">
        <span class="cover" v-else></span>
        <span v-if="item.Difficulté" class="difficulty">
          <svg v-for="n in 3" :class="{off: item.Difficulté < n}" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
        </span>
        <small class="subtitle">{{item.Remplacé}}</small>
        <strong class="title">{{item.Alternative}}</strong>
        <nav class="links">
          <router-link class="category" v-for="category in item.categories" :to="{name: 'Category', params: {category: category.slug}}">{{category.name}}</router-link>          
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
        <span v-show="item.expanded" class="desc">
          <span>{{item.Description}}</span>
        </span>
        <button :class="['check', {checked: item.checked}]" v-on:click.prevent="check(item.id)" type="button">
          <span>
            <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M23.334 11.96c-.713-.726-.872-1.829-.393-2.727.342-.64.366-1.401.064-2.062-.301-.66-.893-1.142-1.601-1.302-.991-.225-1.722-1.067-1.803-2.081-.059-.723-.451-1.378-1.062-1.77-.609-.393-1.367-.478-2.05-.229-.956.347-2.026.032-2.642-.776-.44-.576-1.124-.915-1.85-.915-.725 0-1.409.339-1.849.915-.613.809-1.683 1.124-2.639.777-.682-.248-1.44-.163-2.05.229-.61.392-1.003 1.047-1.061 1.77-.082 1.014-.812 1.857-1.803 2.081-.708.16-1.3.642-1.601 1.302s-.277 1.422.065 2.061c.479.897.32 2.001-.392 2.727-.509.517-.747 1.242-.644 1.96s.536 1.347 1.17 1.7c.888.495 1.352 1.51 1.144 2.505-.147.71.044 1.448.519 1.996.476.549 1.18.844 1.902.798 1.016-.063 1.953.54 2.317 1.489.259.678.82 1.195 1.517 1.399.695.204 1.447.072 2.031-.357.819-.603 1.936-.603 2.754 0 .584.43 1.336.562 2.031.357.697-.204 1.258-.722 1.518-1.399.363-.949 1.301-1.553 2.316-1.489.724.046 1.427-.249 1.902-.798.475-.548.667-1.286.519-1.996-.207-.995.256-2.01 1.145-2.505.633-.354 1.065-.982 1.169-1.7s-.135-1.443-.643-1.96zm-12.584 5.43l-4.5-4.364 1.857-1.857 2.643 2.506 5.643-5.784 1.857 1.857-7.5 7.642z"/></svg>
            Fait !
          </span>
        </button>
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
      },
      expand(id) {
        const target = this.items.filter((item) => item.id === id)[0]
        target.expanded = !target.expanded
      },
      check(id) {
        const target = this.items.filter((item) => item.id === id)[0]
        target.checked = !target.checked
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
  
  .item {
    display: block;
    background-color: white;
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
    opacity: .8;
    position: relative;
    z-index: 1;
    clear: left;

    > span {
      font-size: .9em;
    }
  }

  .check {
    appearance: none;
    border: 1px solid;
    padding: .5em .8em .4em;
    color: $green;
    font-weight: bold;
    border-radius: 3px;
    position: absolute;
    bottom: 1em; right: 1em;
    cursor: pointer;
    opacity: .5;

    &:hover {
      opacity: 1;
    }

    &.checked {
      background-color: $green;
      color: white;
      opacity: 1;
      border-color: transparent;
    }

    > span {
      display: inline-flex;
      align-items: center;
      font-size: 1.3em;

      > svg {
        width: 1.2em; height: 1.2em;
        margin-right: .5em;
      }
    }
  }
</style>
