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

<style lang="scss">
  @import './scss/vars';

  * {
    line-height: 1.418;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }  

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    color: #2c3e50;
    overflow: hidden;
    padding: 0 1em;
    max-width: 45em;
    margin: auto;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: normal;
    color: DodgerBlue;
  }

  a {
    color: $blue;
    
    &:hover,
    &:focus {
      color: mix(white, $blue, 40);
    }
  }
</style>
