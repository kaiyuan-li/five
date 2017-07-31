import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import mutations from './mutations'

Vue.use(Vuex)

// game configuration
const config = {
  row: 9,
  col: 9,
  initialBalls: 3,
  num2IncPerRound: 3,
  num2Cancel: 5,
  gridSize: 55,
  margin: 5,
  boardWidth: 800,
  boardHeight: 800,
  colors: ['red', 'yellow', 'blue', 'white', 'pink', 'purple', 'green']
}

const board = _.range(config.row).map((i) => {
  return _.range(config.col).map((j) => {
    return {
      ball: {
        color: null,
        isSelected: false
      },
      color: 'white'
    }
  })
})

// selected ball position {x: x, y: y}
const selected = {
  position: null
}

// root state object.
// each Vuex instance is just a single state tree.
const state = {
  score: 0,
  config,
  board,
  selected,
  // operation info
  opInfo: {
    // status: ["idle", "origin selected"]
    status: 'idle',
    origin: {
      x: -1,
      y: -1
    },
    target: {
      x: -1,
      y: -1
    }
  }
}

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
  initialize: ({ commit }) => commit('initialize'),
  handleClickOnBall: ({ commit }, payload) => commit('handleClickOnBall', payload),
  handleClickOnGrid: ({ commit }, payload) => commit('handleClickOnGrid', payload)
}

// getters are functions
const getters = {
  evenOrOdd: state => state.count % 2 === 0 ? 'even' : 'odd'
}

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
