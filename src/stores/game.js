import { defineStore } from "pinia"
import { CIRCLE, CROSS, EMPTY, POSITIONS } from "@/constants.js"
import { InvalidUserError } from "@/errors/InvalidUserError.js"
import { singleBoardWinner, tt9BoardsWinner } from "@/utilities.js"


const symbols = [CIRCLE, CROSS]


function swapActivePlayer() {
  switch (this.activePlayer) {
    case CIRCLE:
      this.activePlayer = CROSS
      break
    case CROSS:
      this.activePlayer = CIRCLE
      break
    default:
      throw new InvalidUserError(this.activePlayer)
  }
}


function generateMatrix() {
  const tt9Matrix = {}
  for (let tt9BoardPosition in POSITIONS) {
    const singleMatrix = {}
    tt9Matrix[tt9BoardPosition] = singleMatrix
    for (let singleBoardPosition in POSITIONS) {
      singleMatrix[singleBoardPosition] = EMPTY
    }
  }
  return tt9Matrix
}


function calculateAndSetActiveBoards(gameStore, tt9BoardPosition, cellPosition) {
  if (gameStore.wonBoards[cellPosition] === EMPTY) {
    gameStore.activeBoards = [cellPosition]
  } else {
    gameStore.activeBoards = Object.keys(POSITIONS)
                                   .filter(position => gameStore.wonBoards[position] === EMPTY)
  }
}


function updateBoardState(gameStore, boardPosition, cellPosition) {
  const sbw = singleBoardWinner(gameStore, boardPosition, cellPosition)
  console.debug({sbw})
  if (sbw !== EMPTY) {
    gameStore.wonBoards[boardPosition] = sbw
    calculateAndSetActiveBoards(gameStore, boardPosition, cellPosition)
    gameStore.winner = tt9BoardsWinner(gameStore)
    return detectWinner(gameStore)
  } else {
    calculateAndSetActiveBoards(gameStore, boardPosition, cellPosition)
  }
  return false
}


function detectWinner(gameStore) {
  if (gameStore.winner !== EMPTY) {
    gameStore.recordEvent("Victory", gameStore.winner)
    alert("We have a winner!")
    gameStore.initGame()
    return true
  }
  return false
}


export const useGameStore = defineStore(
  "game",
  {
    state: () => ({
      activePlayer: EMPTY,
      activeBoards: Object.keys(POSITIONS),
      history: [],
      turn: 0,
      winner: EMPTY,
      cells: generateMatrix(),
      wonBoards: Object.fromEntries(Object.keys(POSITIONS).map(position => [position, EMPTY]))
    }),
    getters: {},
    actions: {
      initGame(startingPlayer = EMPTY) {
        this.$reset()

        if (symbols.includes(startingPlayer)) {
          this.activePlayer = startingPlayer
        } else {
          const randomIndex = Math.floor(Math.random() * symbols.length)
          this.activePlayer = symbols[randomIndex]
        }
        this.recordEvent("initActivePlayer", this.activePlayer)

        this.turn = 1
        this.recordEvent("gameStart")
      },
      endTurn(boardPosition, cellPosition) {
        this.recordEvent("endTurn", this.turn)

        const gameEnded = updateBoardState(this, boardPosition, cellPosition)
        if (gameEnded) {
          return
        }

        swapActivePlayer.bind(this)()
        this.recordEvent("newActivePlayer", this.activePlayer)

        this.turn++
        this.recordEvent("startTurn", this.turn)
      },
      recordEvent(eventName, value) {
        this.history.push({event: eventName, value})
      }
    }
  }
)
