<template>
  <div id="app">
    <header class="header">
      <svg class="logo" viewBox="0 0 60.4 70.4" width="60px" height="70px">
        <path transform="translate(60,70) rotate(180)" fill="currentColor" d="M55,24.8L31.6,0.6C31.2,0.2,30.7,0,30.1,0c-0.1,0-0.2,0-0.3,0c-0.9,0-1.6,0.6-1.9,1.4L5.4,24.8l-0.1,0.1 C1.9,28.9,0,34.2,0,39.8s1.9,10.9,5.3,14.9c3.5,4.1,8.1,6.3,13.1,6.3c3.4,0,6.7-1.1,9.6-3.1v10.5c0,1.1,0.9,2,2,2s2-0.9,2-2V57.5 c3,2.3,6.5,3.5,10.1,3.5c5,0,9.6-2.3,13.1-6.3C62.1,46.5,62.1,33.1,55,24.8C55.1,24.9,55.1,24.9,55,24.8z M17.6,17.9l10.2,10.2 v0.1v15.3L10.1,25.7L17.6,17.9z M31.9,22.6v-16l8.2,8.5L31.9,22.6z M27.9,22.5L20.4,15l7.5-7.8V22.5z M31.9,28.1l11-10.1l7.6,7.8 L31.9,43.6V28.1z M18.4,57.1c-3.8,0-7.3-1.8-10-4.9c-2.8-3.3-4.3-7.6-4.3-12.3c0-4.1,1.2-8,3.4-11.1l20.4,20.4v3.4 C25.3,55.5,21.9,57.1,18.4,57.1z M52.1,52.1c-2.7,3.2-6.3,4.9-10,4.9c-3.8,0-7.3-1.8-10-4.9L32,52v-2.9l21.2-20.3 C57.8,35.7,57.5,45.8,52.1,52.1z"/>
      </svg>
      <h1><strong>AlterÉcolo</strong></h1>
      <h3>Alternatives écologiques aux objets et habitudes du quotidien</h3>
    </header>

    <score :score="$store.state.score"/>

    <router-view/>
    
    <footer class="footer">
      <svg class="logo" viewBox="0 0 60.4 70.4" width="60px" height="70px">
        <path transform="translate(60,70) rotate(180)" fill="currentColor" d="M55,24.8L31.6,0.6C31.2,0.2,30.7,0,30.1,0c-0.1,0-0.2,0-0.3,0c-0.9,0-1.6,0.6-1.9,1.4L5.4,24.8l-0.1,0.1 C1.9,28.9,0,34.2,0,39.8s1.9,10.9,5.3,14.9c3.5,4.1,8.1,6.3,13.1,6.3c3.4,0,6.7-1.1,9.6-3.1v10.5c0,1.1,0.9,2,2,2s2-0.9,2-2V57.5 c3,2.3,6.5,3.5,10.1,3.5c5,0,9.6-2.3,13.1-6.3C62.1,46.5,62.1,33.1,55,24.8C55.1,24.9,55.1,24.9,55,24.8z M17.6,17.9l10.2,10.2 v0.1v15.3L10.1,25.7L17.6,17.9z M31.9,22.6v-16l8.2,8.5L31.9,22.6z M27.9,22.5L20.4,15l7.5-7.8V22.5z M31.9,28.1l11-10.1l7.6,7.8 L31.9,43.6V28.1z M18.4,57.1c-3.8,0-7.3-1.8-10-4.9c-2.8-3.3-4.3-7.6-4.3-12.3c0-4.1,1.2-8,3.4-11.1l20.4,20.4v3.4 C25.3,55.5,21.9,57.1,18.4,57.1z M52.1,52.1c-2.7,3.2-6.3,4.9-10,4.9c-3.8,0-7.3-1.8-10-4.9L32,52v-2.9l21.2-20.3 C57.8,35.7,57.5,45.8,52.1,52.1z"/>
      </svg>
      Logo à partir de <a href="https://thenounproject.com/search/?q=leaf&i=1114779" target="_blank">Leaf by Satisfactory (Noun Project)</a>
      <br>
      Icônes provenant de <a href="https://iconmonstr.com/">IconMonstr</a> 
      <br>
      © {{new Date().getFullYear()}} Les contenus sont la propriété de leurs auteurs respectifs.
      <br>
      <a href="https://github.com/nicooprat/alterecolo">Code disponible</a> sous license MIT. <a href="mailto:contact@alterecolo.fr">Contact</a>
    </footer>
  </div>
</template>

<script>
  import Score from '@/components/Score'

  export default {
    name: 'app',
    components: {
      Score
    }
  }
</script>

<style lang="scss">
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

  .header {
    
    .logo {
      width: auto;
      height: 3.4em;
      margin-top: -.2em;
      position: absolute;
      right: 100%;
      color: $green;
      overflow: visible;

      @media (max-width: 900px) {
        position: static;
        margin-top: 1em;
      }

      @media (max-width: 600px) {
        height: 2em;
      }
    }

    h1 {
      margin-top: 10vh;
      margin-bottom: 0;
      color: $green;

      @media (max-width: 900px) {
        margin-top: 0;
      }

      > strong {
        position: relative;
        z-index: 0;

        &:before {
          content: '';
          position: absolute;
          bottom: .1em; left: -2.5em; right: -2.5em;
          height: .35em;      
          background-color: currentColor;
          opacity: .07;
          transform: skew(-20deg);

          @media (max-width: 900px) {
            left: -.15em;
            right: -.15em;
          }
        }
      }
    }

    h3 {
      margin-top: 0;
      color: $green;
      font-weight: 500;
      opacity: .65;
    }
  }

  footer {
    font-size: .8em;
    margin: 5vh 0;
    text-align: center;
    color: rgba($text,.5);

    .logo {
      display: block;
      margin: auto;
      color: rgba(black,.1);
      margin-bottom: 5vh;
    }

    a {
      color: inherit;
      text-decoration: none;
      border-bottom: 1px solid;

      &:hover {
        color: $blue;
      }
    }
  }

  [data-name="mojs-shape"] {
    z-index: 999;
    pointer-events: none;
  }
</style>
