<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    overflow: hidden;
    padding: 0 1em;
    max-width: 50em;
    margin: auto;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: normal;
    color: DodgerBlue;
  }
</style>
