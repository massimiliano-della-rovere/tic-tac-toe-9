import { nextTick } from "vue"

import { CROSS, EMPTY } from "@/lib/constants/content.js"
import { CORNERS, SIDES, OPPOSITE_CORNER, POSITIONS } from "@/lib/constants/position.js"
import {
  FORK_DETECTION_PATHS, WINNER_DETECTION_PATHS,
  SITUATION_INIT, ACTION_RATINGS, SYMBOL_TO_SIGN
} from "@/lib/constants/gameLogic.js"

import { takeEmpty } from "@/lib/utilities.js"
import { otherPlayer } from "@/lib/gameLogic.js"


function* _winSituations(activeSymbol, otherSymbol, cells, boardPosition) {
  const board = cells[boardPosition]
  for(const positions of WINNER_DETECTION_PATHS) {
    for (const path of positions) {

      const situation = Object.fromEntries(SITUATION_INIT)
      for (const position of path) {
        situation[board[position]].push(position)
      }

      // win
      if (situation[activeSymbol].length === 2 && situation[EMPTY].length === 1) {
        yield {
          type: "win",
          boardPosition,
          cellPosition: situation[EMPTY][0],
          symbol: activeSymbol
        }
      }

      // block win
      if (situation[otherSymbol].length === 2 && situation[EMPTY].length === 1) {
        yield {
          type: "block_win",
          boardPosition,
          cellPosition: situation[EMPTY][0],
          symbol: activeSymbol
        }
      }
    }
  }
}


function* _forkSituations(activeSymbol, otherSymbol, cells, boardPosition) {
  const board = cells[boardPosition]
  for (const {controlled, tests} of FORK_DETECTION_PATHS) {
    for (const situation of [{actionType: "fork", testSymbol: activeSymbol},
      {actionType: "block_fork", testSymbol: otherSymbol}]) {

      if (controlled.some(position => board[position] !== situation.testSymbol)) {
        break
      }

      for (const position of takeEmpty(tests, board)) {
        yield {
          type: situation.actionType,
          boardPosition,
          cellPosition: position,
          symbol: activeSymbol
        }
      }
    }
  }
}


function* _centerSituations(activeSymbol, otherSymbol, cells, boardPosition) {
  const board = cells[boardPosition]
  if (board.o === EMPTY) {
    // center
    const suffix = Object.values(board).every(cell => cell === EMPTY)
        ? "1st_move"
        : "generic_move"
    yield {
      actionType: `center_${suffix}`,
      boardPosition,
      cellPosition: "o",
      symbol: activeSymbol}
  }
}


function* _oppositeCornerSituations(activeSymbol, otherSymbol, cells, boardPosition) {
  const board = cells[boardPosition]
  for (const [referenceCorner, oppositeCorner] of Object.entries(OPPOSITE_CORNER)) {
    // opposite corner
    if (board[referenceCorner] === otherSymbol && board[oppositeCorner] === activeSymbol) {
      yield {
        actionType: "opposite_corner",
        boardPosition,
        cellPosition: oppositeCorner,
        symbol: activeSymbol
      }
    }
  }
}


function* _emptyCornerSituations(activeSymbol, otherSymbol, cells, boardPosition) {
  const board = cells[boardPosition]
  for (const emptyCorner of takeEmpty(CORNERS, board)) {
    // empty corner
    yield {
      actionType: "corner",
      boardPosition,
      cellPosition: emptyCorner,
      symbol: activeSymbol
    }
  }
}


function* _emptySideSituations(activeSymbol, otherSymbol, cells, boardPosition) {
  const board = cells[boardPosition]
  for (const emptySide of takeEmpty(SIDES, board)) {
    // empty side
    yield {
      actionType: "side",
      boardPosition,
      cellPosition: emptySide,
      symbol: activeSymbol
    }
  }
}


const ACTION_GENERATORS = [
  _winSituations,
  _forkSituations,
  _emptyCornerSituations,
  _centerSituations,
  _oppositeCornerSituations,
  _emptySideSituations]


function _generateActions(referenceAction, activeSymbol,
                          originalCells, boardPosition,
                          originalActiveBoards, originalWonBoards,
                          step) {
  console.debug(`thinking: ${JSON.stringify({step, activeSymbol, arguments})}`)
  if (!step) {
    return []
  }

  const opponentSymbol = otherPlayer(activeSymbol)
  const parameters = [
    activeSymbol, opponentSymbol,
    originalCells, boardPosition]
  const actions = ACTION_GENERATORS.flatMap(
      actionGenerator => Array.from(actionGenerator.apply(null, parameters)))

  for (const action of actions) {
    let wonBoards
    if (action.actionType === "win") {
      wonBoards = Object.create(originalWonBoards)
      wonBoards[boardPosition] = activeSymbol
    } else {
      wonBoards = originalWonBoards
    }
    const activeBoards = wonBoards[action.cellPosition] === EMPTY
        ? [action.cellPosition]
        : takeEmpty(Object.keys(POSITIONS), wonBoards)
    const cells = JSON.parse(JSON.stringify(originalCells))  // deep clone
    cells[action.boardPosition][action.cellPosition] = action.symbol
    for (const activeBoard of activeBoards) {
      if (action.actionType !== "win") {
        action.actions = _generateActions(
            action, opponentSymbol,
            cells, activeBoard,
            activeBoards, wonBoards,
            step - 1)
      }
    }
  }
  // console.debug(JSON.stringify({step, activeSymbol, actions}))

  if (referenceAction) {
    referenceAction.actions = actions
  }

  return actions
}


const _actionScoreCalculator = action => SYMBOL_TO_SIGN[action.symbol] * ACTION_RATINGS[action.actionType]

function _rateAction(referenceAction) {
  referenceAction.score = _actionScoreCalculator(referenceAction)
  if (referenceAction.actions.length) {
    const selector = referenceAction.symbol === CROSS ? Math.max : Math.min
    const actionsScore = selector(...referenceAction.actions.map(action => _rateAction(action)))
    return referenceAction.score + actionsScore
  } else {
    return referenceAction.score
  }
}


function* _linearizeActionLog(referenceAction) {
  const prefixParts = [
    referenceAction.symbol,
    referenceAction.actionType,
    referenceAction.score,
    referenceAction.boardPosition,
    referenceAction.cellPosition
  ]
  let prefix = prefixParts.join("·")
  if (referenceAction.totalScore !== undefined) {
    prefix = `${referenceAction.totalScore}#${prefix}`
  }

  if (referenceAction.actions.length) {
    for (const action of referenceAction.actions) {
      for (const suffix of _linearizeActionLog(action)) {
        yield `${prefix}::${suffix}`
      }
    }
  } else {
    yield prefix
  }
}


// eslint-disable-next-line no-unused-vars
function logActions(actions) {
  return actions.flatMap(action => Array.from(_linearizeActionLog(action)))
}


function aiCalculateAction({activePlayer, cells, activeBoards, wonBoards, aiDepth}) {
  const actions = []
  for (const boardPosition of activeBoards) {
    actions.push(..._generateActions(
        null,
        activePlayer,
        JSON.parse(JSON.stringify(cells)),  // deep clone
        boardPosition,
        Array.from(activeBoards),
        Object.create(wonBoards),
        aiDepth))
  }
  // console.debug(actions)

  for (let action of actions) {
    // console.log({score:_rateAction(action), action})
    action.totalScore = _rateAction(action)
  }
  logActions(actions)
  return actions
      .sort((a, b) => a.totalScore - b.totalScore)
      .slice(-1)[0]
}


async function aiTurn(parameters, gameStateStore, gameControlStore, gameLogStore) {



  const aiAction = await aiCalculateAction(parameters)
  const cellID = `cell-${aiAction.boardPosition}-${aiAction.cellPosition}`
  gameStateStore.cells[aiAction.boardPosition][aiAction.cellPosition] = aiAction.symbol
  gameLogStore.recordEvent(
    "AICell",
    {cellID, owner: gameControlStore.activePlayer})
  console.debug(`${cellID} is owned by ${gameControlStore.activePlayer}`)
  console.debug(`next board(s): ${gameControlStore.activeBoards.join(", ")}`)
  await nextTick()
  await gameControlStore.endTurn.call(gameControlStore, aiAction.boardPosition, aiAction.cellPosition)
}


export { aiCalculateAction, aiTurn, logActions }