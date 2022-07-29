import { defineStore } from "pinia"
import { useToast } from "vue-toastification"
import { CIRCLE, CROSS, EMPTY, POSITIONS } from "@/constants.js"
import { InvalidUserError } from "@/errors/InvalidUserError.js"
import { singleBoardWinner, tt9BoardsWinner } from "@/utilities.js"


const symbols = [CIRCLE, CROSS]
const toast = useToast()


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


async function updateBoardState(gameStore, boardPosition, cellPosition) {
  const sbw = singleBoardWinner(gameStore, boardPosition, cellPosition)
  console.debug({sbw})
  if (sbw !== EMPTY) {
    gameStore.wonBoards[boardPosition] = sbw
    calculateAndSetActiveBoards(gameStore, boardPosition, cellPosition)
    gameStore.winner = tt9BoardsWinner(gameStore)
    return await detectWinner(gameStore)
  } else {
    calculateAndSetActiveBoards(gameStore, boardPosition, cellPosition)
  }
  return false
}


async function detectWinner(gameStore) {
  if (gameStore.winner !== EMPTY) {
    gameStore.recordEvent("Victory", gameStore.winner)
    await new Promise((resolve) => {
      toast.success(
        `We have a winner: ${gameStore.winner}!`,
        {onClose: () => { resolve() }})
    })
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
      wonBoards: Object.fromEntries(
          Object.keys(POSITIONS)
                .map(position => [position, EMPTY]))
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
        toast.info(`A new game is starting, first player is ${this.activePlayer}`)

        this.turn = 1
        this.recordEvent("gameStart")
      },
      async endTurn(boardPosition, cellPosition) {
        this.recordEvent("endTurn", this.turn)

        const gameEnded = await updateBoardState(this, boardPosition, cellPosition)
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
