<template>
  <g :transform="transform" @click="handleClickOnGrid">
    <rect :style="gridStyle" />
    <circle v-if="hasBall" :style="circleStyle" :class="circleClass" @click="handleClickOnBall"/>
  </g>
</template>

<script>
export default {
  name: 'grid',
  props: ['indexI', 'indexJ', 'gridData'],
  data () {
    return {
      gridSize: this.$store.state.config.gridSize,
      translateX: this.indexI * (this.$store.state.config.gridSize + this.$store.state.config.margin),
      translateY: this.indexJ * (this.$store.state.config.gridSize + this.$store.state.config.margin)
    }
  },
  methods: {
    handleClickOnBall (e) {
      // handle clicking on ball, this is to select one ball
      e.stopPropagation()
      this.$store.dispatch('handleClickOnBall', {x: this.indexI, y: this.indexJ})
    },
    handleClickOnGrid (e) {
      // handle clicking on a grid, this is to select the target grid to move the ball
      e.stopPropagation()
      this.$store.dispatch('handleClickOnGrid', {x: this.indexI, y: this.indexJ})
    }
  },
  computed: {
    transform () {
      return `translate(${this.translateX}, ${this.translateY})`
    },
    hasBall () {
      return this.gridData.ball.color && true
    },
    gridStyle () {
      return {
        width: this.$store.state.config.gridSize,
        height: this.$store.state.config.gridSize,
        stroke: 'white',
        fill: ((this.indexI + this.indexJ) % 2 === 1 ? 'black' : 'grey')
      }
    },
    circleClass () {
      return {
        breath: this.gridData.ball.isSelected
      }
    },
    circleStyle () {
      return {
        cx: this.$store.state.config.gridSize / 2,
        cy: this.$store.state.config.gridSize / 2,
        r: this.$store.state.config.gridSize * 0.4,
        fill: this.gridData.ball.color
      }
    }
  }
}
</script>

<style scoped>
@keyframes selected {
  0% {opacity: 1;}
  50% {opacity: 0.3;}
  100% {opacity: 1;}
}

.breath {
  animation-name: selected;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}
</style>
