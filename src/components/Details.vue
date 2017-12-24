<template>
  <article v-if="item">
    <Item :item="item"/>
    <p>{{item.Description}}</p>
  </article>
  <main v-else>404</main>
</template>

<script>
  import Item from '@/components/Item'

  export default {
    name: 'Details',
    components: {
      Item,
    },
    props: ['item'],
    computed: {},
    created() {},
    methods: {}
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  p {
    white-space: pre-wrap;
  }
</style>
