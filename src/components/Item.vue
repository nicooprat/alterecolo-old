<template>
  <li :class="['item', {'is-checked': checked}]">
    <img class="cover" v-if="item.cover" :src="item.cover.thumbnails.large.url" :alt="item.Alternative" :width="item.cover.thumbnails.large.width" :height="item.cover.thumbnails.large.height">
    <span class="cover" v-else></span>
    <span v-if="item.Difficulté" class="difficulty">
      <svg v-for="n in 3" :class="{off: item.Difficulté < n}" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
    </span>
    <small class="subtitle">{{item.Remplacé}}</small>
    <router-link class="title" :to="{name: 'Details', params: {slug: item.slug, id: item.id}}">{{item.Alternative}}</router-link>
    <nav class="links">
      <router-link class="category" v-for="category in item.categories" :key="category.slug" :to="{name: 'Category', params: {category: category.slug}}">{{category.name}}</router-link>
      <a class="source" v-if="item.Lien" :href="item.Lien">
        Source
        <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"/></svg>
      </a>
      <router-link class="comments" :to="{name: 'Details', params: {slug: item.slug, id: item.id}}">
        <a :href="$router.resolve({name: 'Details', params: {slug: item.slug, id: item.id}, hash: '#disqus_thread'}).route.fullPath"></a>
        <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3c5.514 0 10 3.592 10 8.007 0 4.917-5.144 7.961-9.91 7.961-1.937 0-3.384-.397-4.394-.644-1 .613-1.594 1.037-4.272 1.82.535-1.373.722-2.748.601-4.265-.837-1-2.025-2.4-2.025-4.872 0-4.415 4.486-8.007 10-8.007zm0-2c-6.338 0-12 4.226-12 10.007 0 2.05.739 4.063 2.047 5.625.055 1.83-1.023 4.456-1.993 6.368 2.602-.47 6.301-1.508 7.978-2.536 1.417.345 2.774.503 4.059.503 7.084 0 11.91-4.837 11.91-9.961-.001-5.811-5.702-10.006-12.001-10.006z"/></svg>
      </router-link>
      <button class="check" v-on:click.prevent="check($event, item)" type="button">
        <span>
          <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M23.334 11.96c-.713-.726-.872-1.829-.393-2.727.342-.64.366-1.401.064-2.062-.301-.66-.893-1.142-1.601-1.302-.991-.225-1.722-1.067-1.803-2.081-.059-.723-.451-1.378-1.062-1.77-.609-.393-1.367-.478-2.05-.229-.956.347-2.026.032-2.642-.776-.44-.576-1.124-.915-1.85-.915-.725 0-1.409.339-1.849.915-.613.809-1.683 1.124-2.639.777-.682-.248-1.44-.163-2.05.229-.61.392-1.003 1.047-1.061 1.77-.082 1.014-.812 1.857-1.803 2.081-.708.16-1.3.642-1.601 1.302s-.277 1.422.065 2.061c.479.897.32 2.001-.392 2.727-.509.517-.747 1.242-.644 1.96s.536 1.347 1.17 1.7c.888.495 1.352 1.51 1.144 2.505-.147.71.044 1.448.519 1.996.476.549 1.18.844 1.902.798 1.016-.063 1.953.54 2.317 1.489.259.678.82 1.195 1.517 1.399.695.204 1.447.072 2.031-.357.819-.603 1.936-.603 2.754 0 .584.43 1.336.562 2.031.357.697-.204 1.258-.722 1.518-1.399.363-.949 1.301-1.553 2.316-1.489.724.046 1.427-.249 1.902-.798.475-.548.667-1.286.519-1.996-.207-.995.256-2.01 1.145-2.505.633-.354 1.065-.982 1.169-1.7s-.135-1.443-.643-1.96zm-12.584 5.43l-4.5-4.364 1.857-1.857 2.643 2.506 5.643-5.784 1.857 1.857-7.5 7.642z"/></svg>
          Fait !
        </span>
      </button>
    </nav>
  </li>
</template>

<script>
  import mojs from 'mo-js'

  export default {
    name: 'Item',
    props: ['item'],
    computed: {
      checked() {
        return this.$store.state.checkeds.includes(this.item.id)
      }
    },
    created() {},
    methods: {
      check(e, item) {
        this.$store.commit('toggleCheckItem', {item})
        this.burst(e)
      },
      burst(e) {
        if (this.checked) {
          const bounds = e.currentTarget.getClientRects()[0]

          const duration = 350

          const cloud = new mojs.Burst({
            parent: e.currentTarget,
            left: bounds.width / 2,
            top: bounds.height / 2,
            radius: { 4: 49 },
            angle: 45,
            count: 12,
            children: {
              radius: 10,
              fill: '#00cf4c',
              opacity: 0.2,
              scale: { 1: 0, easing: 'sin.in' },
              pathScale: [ 0.7, null ],
              degreeShift: [ 13, null ],
              duration: [ 500, 700 ],
              isShowEnd: false,
              isForce3d: true
            },
            onComplete() { this.el.remove() }
          })

          const burst = new mojs.Burst({
            parent: e.currentTarget,
            left: bounds.width / 2,
            top: bounds.height / 2,
            count: 10,
            radius: { 10: 60 },
            angle: 90,
            children: {
              shape: 'line',
              stroke: '#00cf4c',
              strokeWidth: 2,
              strokeLinecap: 'round',
              opacity: 0.5,
              radius: 25,
              scale: 1,
              scaleX: { 1: 0 },
              duration: duration,
              isForce3d: true,
            },
            onComplete() { this.el.remove() }
          })

          new mojs.Timeline()
          .add(cloud, burst)
          .replay()
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  .item {
    display: block;
    background-color: white;
    box-shadow: 0 0 0 1px rgba(black,.05), 0 1px 2px rgba(black,.1);
    border-radius: 3px;
    margin-bottom: 2em;
    padding: 1em;
    padding-left: 7.5em;
    position: relative;
    z-index: 1; // Each item above previous
    transition: opacity 350ms;

    &.is-checked {
      box-shadow: 0 0 0 1px rgba($green,.5), 0 1px 2px rgba($green,.25);
    }
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
        opacity: .65;

        path {
          fill: none;
        }
      }
    }
  }

  .subtitle {
    display: block;
    font-size: 1em;
    opacity: .5;
  }

  .title {
    display: block;
    font-size: 1.25em;
    color: inherit;
    text-decoration: none;
    margin-right: 5em;
    line-height: 1.2;

    &:before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      z-index: 0;
      border-radius: 3;
      transition: box-shadow 250ms;
    }

    &:hover:before {
      box-shadow: 0 2px 10px rgba(black,.15);
    }
  }

  .links {
    display: flex;
    align-items: center;
    font-size: .9em;

    > a {
      margin-right: 1em;
      text-decoration: none;
      position: relative;
      z-index: 1; // Above other links

      > svg {
        width: 0.75em; height: 0.75em;
        margin-left: .25em;
      }

      // Disqus count
      > a {
        text-decoration: none;

        &:empty + svg {
          display: none;
        }
      }
    }
  }

  .category {
    font-weight: bold;
    border-bottom-width: 2px !important;
  }

  .comments {
  }

  .check {
    margin-left: auto;
    appearance: none;
    border: 1px solid;
    padding: .5em .8em .4em;
    color: $green;
    font-weight: bold;
    border-radius: 3px;
    cursor: pointer;
    outline: none;
    font-size: .9em;
    position: relative;
    z-index: 1; // Above other links

    &:hover {
      background-color: rgba($green, .1);
    }

    .is-checked & {
      background-color: $green;
      color: white;
      opacity: 1;
      border-color: transparent;
    }

    > span {
      display: inline-flex;
      align-items: center;

      > svg {
        width: 1.2em; height: 1.2em;
        margin-right: .5em;
      }
    }
  }
</style>
