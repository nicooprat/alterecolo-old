<template>
  <div id="app">
    <Head/>
    <Score/>
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
    <Foot/>
  </div>
</template>

<script>
  import Head from '@/components/Head'
  import Score from '@/components/Score'
  import Foot from '@/components/Foot'

  export default {
    name: 'app',
    components: {
      Head,
      Score,
      Foot
    }
  }
</script>

<style lang="scss">
  @import '~normalize.css';

  $rfs-minimum-font-size: 16;
  $rfs-breakpoint: 900;
  @import '~rfs';

  @import './scss/vars';

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s ease;
  }
  .fade-enter, .fade-leave-active {
    opacity: 0
  }
  .child-view {
    position: absolute;
    transition: all .5s cubic-bezier(.55,0,.1,1);
  }
  .slide-left-enter, .slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate(30px, 0);
    transform: translate(30px, 0);
  }
  .slide-left-leave-active, .slide-right-enter {
    opacity: 0;
    -webkit-transform: translate(-30px, 0);
    transform: translate(-30px, 0);
  }

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
    scroll-behavior: smooth;
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
