<template>
  <article v-if="item">
    <Item :item="item" :key="item.id"/>
    <blockquote>
      <p>{{item.Description}}</p>
      <cite v-if="item.Lien">
        <a :href="item.Lien">
          {{item.Lien}}
        </a>
        <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"/></svg>
      </cite>
    </blockquote>
    <vue-disqus shortname="alterecolo"></vue-disqus>
  </article>
  <main v-else>404</main>
</template>

<script>
  import Item from '@/components/Item'
  import VueDisqus from 'vue-disqus/VueDisqus.vue'

  export default {
    name: 'Details',
    components: {
      Item,
      VueDisqus
    },
    props: ['item'],
    computed: {},
    mounted() {
      // Update Disqus comments counts
      /* global DISQUSWIDGETS */
      DISQUSWIDGETS && DISQUSWIDGETS.getCount({reset: true})
    },
    methods: {}
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  article {

    @media (min-width: $break) {
      padding-top: 4em;
    }
  }

  blockquote {
    margin: 0;
    margin-bottom: 2em;
  }

  cite {
    display: flex;
    align-items: center;
    margin-top: 1em;
    font-size: .9em;

    a {
      font-style: normal;
      text-decoration: none;
      border-bottom: 1px solid;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    svg {
      width: 0.75em; height: 0.75em;
      margin-left: .5em;
      color: $blue;
    }
  }

  p {
    white-space: pre-wrap;
  }
</style>
