<template>
  <article v-if="item">
    {{item.Alternative}}
  </article>
  <main v-else>404</main>
</template>

<script>
  export default {
    name: 'Details',
    props: ['item'],
    computed: {},
    created() {},
    methods: {}
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';
</style>
