<template>
<div>
  <div id="scorecard">
    <p>{{$store.state.score}}</p>
  </div>
  <svg :width="boardWidth" :height="boardHeight">
    <template v-for="(col,indexI) in boardModel">
      <template v-for="(gridData,indexJ) in col">
        <grid :indexI="indexI" :indexJ="indexJ" :gridData="gridData"></grid>
      </template>
    </template>
  </svg>
</div>
</template>

<script>
import store from '@/store'
import grid from '@/components/Grid'
import { mapActions } from 'vuex'

export default {
  store,
  name: 'board',
  components: {
    grid
  },
  data () {
    return {
      gridSize: this.$store.state.config.gridSize,
      margin: this.$store.state.config.margin
    }
  },
  computed: {
    boardWidth () {
      return this.$store.state.config.boardWidth
    },
    boardHeight () {
      return this.$store.state.config.boardHeight
    },
    boardModel () {
      return this.$store.state.board
    }
  },
  methods: mapActions([
    'initialize',
    'handleClickOnGrid',
    'handleClickOnBall'
  ]),
  created () {
    // console.log('hi')
    // initialize store data structure by submitting action.
    this.$store.dispatch('initialize')
  }
}
</script>

<style scoped>
#scorecard {
  background-color: #FFFFFF;
}
</style>