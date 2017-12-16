<template>
  <div class="hello">
    <h1>AlterÉcolo</h1>

    <ul class="list" v-if="items">
      <li class="item" v-for="item in items">
        <img class="cover" v-if="item.cover" :src="item.cover.thumbnails.large.url" :alt="item.Alternative" :width="item.cover.thumbnails.large.width" :height="item.cover.thumbnails.large.height">
        <span v-if="item.Difficulté" class="difficulty">
          <svg v-for="n in 3" :class="{on: item.Difficulté >= n}" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
        </span>
        <small class="subtitle">{{item.Remplacé}}</small>
        <strong class="title">{{item.Alternative}}</strong>
        <nav class="links" v-if="item.Catégorie">
          <a class="category" href="#" v-for="category in item.Catégorie">{{category}}</a>          
          <a class="source" v-if="item.Lien" :href="item.Lien">Source</a>
          <a class="expand" v-if="item.Lien" href="#" v-on:click.prevent="expand(item.id)">Plus d'infos</a>
        </nav>
        <span v-show="item.expanded" class="desc">{{item.Description}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  import Airtable from 'airtable'
  const base = new Airtable({apiKey: 'keycOP14E2tfhJ9fI'}).base('appI12batrjUkkAdC')

  export default {
    name: 'Home',
    data() {
      return {
        items: []
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
        }).eachPage((records, fetchNextPage) => {
          // Load items in component
          this.items.push(...records.map((item) => {
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

  .list {
    list-style: none;
    padding-left: 0;
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
    margin-top: -1em;
    margin-left: -7.5em;
  }

  .difficulty {
    float: right;
    
    svg {
      display: inline-block;
      width: 18px; height: 18px;
      margin-left: .25em;
      color: rgba(black,.1);

      &.on {
        color: gold;        
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

    > a {
      color: $blue;
      display: inline-block;
      margin-right: .5em;
    }
  }

  .category {
    text-decoration: none;
    font-weight: bold;
    position: relative;
    z-index: 0;
    white-space: nowrap;

    &:before {
      content: '';
      position: absolute;
      bottom: .1em; left: -.25em; right: -.25em;
      height: .5em;
      background: currentColor;
      opacity: .07;
    }
  }

  .desc {
    display: block;
    margin: -1em;
    margin-top: 0;
    margin-left: -7.5em;
    padding: 1em;
    background-color: mix(black, white, 3);
    position: relative;
    z-index: 1;
    clear: left;
  }
</style>
