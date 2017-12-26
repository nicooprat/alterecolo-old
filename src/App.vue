<template>
  <div id="app">
    <Head/>
    <Score/>
    <Home v-if="$route.name !== 'Details'"/>
    <router-view/>
    <Foot/>
  </div>
</template>

<script>
  import Home from '@/components/Home'
  import Head from '@/components/Head'
  import Score from '@/components/Score'
  import Foot from '@/components/Foot'

  export default {
    name: 'app',
    components: {
      Home,
      Head,
      Score,
      Foot
    },
    computed: {},
    created() {},
    mounted() {},
  }
</script>

<style lang="scss">
  @import '~normalize.css';

  $rfs-minimum-font-size: 16;
  $rfs-breakpoint: 900;
  @import '~rfs';

  @import './scss/vars';

  * {
    line-height: 1.418;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html {
    font-family: 'Lato', Helvetica, Arial, sans-serif;
    font-size: 16px;
    color: $text;
    background-color: #fcfcfb;
  }

  #app {
    padding: 0 1em;
    max-width: 45rem;
    margin: auto;
    position: relative;
    @include rfs(18);
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: normal;
    line-height: 1.2;
  }

  a {
    color: $blue;

    &:hover {
      color: mix(white, $blue, 40);
    }
  }

  [data-name="mojs-shape"] {
    z-index: 999;
    pointer-events: none;
  }
</style>
