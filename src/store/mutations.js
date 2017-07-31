// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.

export default {
  initialize (state) {
    // console.log('initializing in vuex')
    // populate board with balls
    // console.log(state.config.initialBalls)
    clearBoard(state)
    prepopulateBoard(state)
  },

  handleClickOnBall (state, position) {
    console.log('handling click on ball')
    // if current ball is not selected
    if (!isSelected(state, position)) {
      // if there is a previously selected ball, mark previously selected ball unselected
      if (state.selected.position !== null) {
        state.board[state.selected.position.x][state.selected.position.y].ball.isSelected = false
      }

      // record position of ball to select in state
      state.selected.position = position
      // mark the ball as selected
      state.board[position.x][position.y].ball.isSelected = true
    }
  },

  handleClickOnGrid (state, targetPosition) {
    var ballAtTargetPosition = ballAtPosition(state, targetPosition)
    if (ballAtTargetPosition.color !== null) {
    // if the target board has a ball and user not clicking on the ball, ignore action
    // if there is no currently selected ball, ignore action
    // there is no chance that user clicking on the ball since the event will be captured
    // by the ball click handler
      return
    } else if (state.selected.position === null) {
      return
    } else if (!haveAccess(state, {x: state.selected.position.x, y: state.selected.position.y}, targetPosition)) {
      // if there is no access between target position and the current selected position
      return
    } else {
      // record selected position
      var ballAtOriginPosition = ballAtPosition(state, state.selected.position)
      // unselect current ball
      state.selected.position = null
      ballAtOriginPosition.isSelected = false
      // move the ball to the grid
      ballAtTargetPosition.color = ballAtOriginPosition.color
      ballAtOriginPosition.color = null
    }
    if (!checkAndElimiate(state, targetPosition)) {
      insertNBalls(state, state.config.num2IncPerRound)
    }
  }
}

function inArray (array, p) {
  for (var i = 0; i < array.length; i++) {
    var el = array[i]
    if ((el.x === p.x) && (el.y === p.y)) {
      return true
    }
  }
  return false
}

function haveAccess (state, p1, p2) {
  var p1AccessibleGrids = [p1]
  var newGridPositions = []
  var newGridsFromLastRound = [p1]
  while (newGridsFromLastRound.length > 0) {
    newGridsFromLastRound.forEach((gridPosition) => {
      offset4Moving.forEach((offset) => {
        var potentialPosition = getNextBallPosition(state, gridPosition, offset, 1)
        if ((potentialPosition !== null) && (ballAtPosition(state, potentialPosition).color === null) && (!p1AccessibleGrids.includes(potentialPosition))) {
          if (!inArray(p1AccessibleGrids, potentialPosition)) {
            p1AccessibleGrids.push(potentialPosition)
            newGridPositions.push(potentialPosition)
          }
        }
      })
    })
    newGridsFromLastRound = JSON.parse(JSON.stringify(newGridPositions))
    newGridPositions = []
  }
  return inArray(p1AccessibleGrids, p2)
}

function insertNBalls (state, num) {
  // the number of balls that has already been inserted
  var numOfBallsInserted = 0
  while (numOfBallsInserted < num) {
    var proposedPosition = generateRadomPosition(state)
    while (isOccupied(state, proposedPosition)) {
      proposedPosition = generateRadomPosition(state)
    }
    numOfBallsInserted++
    // console.log(rowIdx, colIdx)
    state.board[proposedPosition.x][proposedPosition.y].ball.color = state.config.colors[Math.floor(Math.random() * state.config.colors.length)]
    checkAndElimiate(state, proposedPosition)
  }
}

// functions to check if two points match in their color
function colorMatch (state, p1, p2) {
  return ballAtPosition(state, p1).color === ballAtPosition(state, p2).color
}

function onBoard (state, p) {
  if ((p.x < 0) || (p.y < 0) || (p.x >= state.config.row) || (p.y >= state.config.col)) {
    return false
  } else {
    return true
  }
}
var directions = [-1, 1]
var offset = [{x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}, {x: -1, y: 1}]
var offset4Moving = [{x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 0, y: -1}]
// get position of the next ball
// direction: vector to specify possible directions
function getNextBallPosition (state, position, offset, direction) {
  // get position of the next ball, direction can be +1 or -1
  var proposedPosition = {
    x: position.x + direction * offset.x,
    y: position.y + direction * offset.y
  }
  if (onBoard(state, proposedPosition)) {
    // if the proposed position is still on board
    return proposedPosition
  } else {
    // return null if the proposed position is already out of board
    return null
  }
}

function checkAndElimiate (state, p) {
  // save current position for future use
  var p0 = p
  var clearHappened = false
  var balls2Clear
  var ballsScored = 0
  offset.forEach((vector) => {
    // record ball positions to cancel at each offset vector type
    balls2Clear = []
    directions.forEach((dir) => {
      p = p0
      p = getNextBallPosition(state, p, vector, dir)
      while (p !== null) {
        if (colorMatch(state, p, p0)) {
          balls2Clear.push(p)
          p = getNextBallPosition(state, p, vector, dir)
        } else {
          break
        }
      }
    })
    if (balls2Clear.length >= state.config.num2Cancel - 1) {
      balls2Clear.forEach((ballPos) => {
        ballAtPosition(state, ballPos).color = null
      })
      ballsScored += balls2Clear.length
      clearHappened = true
    }
  })
  if (clearHappened) {
    state.score += calcScore(ballsScored)
    // clear the ball that is moved also
    ballAtPosition(state, p0).color = null
  }
  return clearHappened
}

function calcScore (numOfBalls) {
  return 9 + Math.pow(3, numOfBalls - 4)
}
function ballAtPosition (state, position) {
  return state.board[position.x][position.y].ball
}

function isSelected (state, position) {
  return state.board[position.x][position.y].ball.isSelected
}

function clearBoard (state) {
  state.score = 0
  state.board.forEach((row) => {
    row.forEach((element) => {
      element.ball.color = null
    })
  }, this)
}

function prepopulateBoard (state) {
  insertNBalls(state, state.config.initialBalls)
}

function isOccupied (state, position) {
  return (state.board[position.x][position.y].ball.color !== null)
}
function generateRadomPosition (state) {
  var rowIdx = Math.floor(Math.random() * state.config.row)
  var colIdx = Math.floor(Math.random() * state.config.col)
  return {
    x: rowIdx,
    y: colIdx
  }
}
