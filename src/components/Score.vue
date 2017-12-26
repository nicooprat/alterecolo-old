<template>
  <span class="score">
    <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M23.334 11.96c-.713-.726-.872-1.829-.393-2.727.342-.64.366-1.401.064-2.062-.301-.66-.893-1.142-1.601-1.302-.991-.225-1.722-1.067-1.803-2.081-.059-.723-.451-1.378-1.062-1.77-.609-.393-1.367-.478-2.05-.229-.956.347-2.026.032-2.642-.776-.44-.576-1.124-.915-1.85-.915-.725 0-1.409.339-1.849.915-.613.809-1.683 1.124-2.639.777-.682-.248-1.44-.163-2.05.229-.61.392-1.003 1.047-1.061 1.77-.082 1.014-.812 1.857-1.803 2.081-.708.16-1.3.642-1.601 1.302s-.277 1.422.065 2.061c.479.897.32 2.001-.392 2.727-.509.517-.747 1.242-.644 1.96s.536 1.347 1.17 1.7c.888.495 1.352 1.51 1.144 2.505-.147.71.044 1.448.519 1.996.476.549 1.18.844 1.902.798 1.016-.063 1.953.54 2.317 1.489.259.678.82 1.195 1.517 1.399.695.204 1.447.072 2.031-.357.819-.603 1.936-.603 2.754 0 .584.43 1.336.562 2.031.357.697-.204 1.258-.722 1.518-1.399.363-.949 1.301-1.553 2.316-1.489.724.046 1.427-.249 1.902-.798.475-.548.667-1.286.519-1.996-.207-.995.256-2.01 1.145-2.505.633-.354 1.065-.982 1.169-1.7s-.135-1.443-.643-1.96zm-12.584 5.43l-4.5-4.364 1.857-1.857 2.643 2.506 5.643-5.784 1.857 1.857-7.5 7.642z"/></svg>
    <strong>{{newScore}}</strong>
  </span>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'Score',
    data() {
      return {
        newScore: this.$store.state.score
      }
    },
    computed: mapState({
      score: state => state.score,
    }),
    watch: {
      score(newValue, oldValue) {
        const order = newValue < oldValue ? -1 : 1
        this.$el.querySelector('strong').animate([{
          transform: 'translateY(0%)',
          opacity: 1
        }, {
          transform: `translateY(calc(${order*-1} * 50%))`,
          opacity: 0
        }], {
          duration: 100,
          easing: 'ease-in'
        }).onfinish = () => {
          this.newScore = newValue
          this.$el.querySelector('strong').animate([{
            transform: `translateY(calc(${order} * 50%))`,
            opacity: 0
          }, {
            transform: 'translateY(0%)',
            opacity: 1
          }], {
            duration: 200,
            easing: 'cubic-bezier(0.175, 0.885, 0.305, 1.605)'
          })
        }
        return false
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  .score {
    position: sticky;
    float: right;
    top: 2em; right: 2em;
    margin-top: 1em;
    margin-right: 1em;
    z-index: 10;
    display: flex;
    align-items: center;
    padding: .5em 1em;
    color: white;
    background-color: $green;
    font-weight: 900;
    border-radius: 3px;
    box-shadow: 0 3px 13px rgba(black,.15);

    > svg {
      margin-right: .5em;
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0
  }
</style>
