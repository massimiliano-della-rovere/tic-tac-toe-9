import { ref } from "vue"
import { defineStore } from "pinia"
import { useToast } from "vue-toastification"

import { EMPTY } from "@/lib/constants/content.js"
import { POSITIONS } from "@/lib/constants/position.js"
import { CONTINUE_GAME, RESTART_GAME } from "@/lib/constants/matchFlow.js"
import { findWinner } from "@/lib/gameLogic.js"

import { useGameControlStore } from "@/stores/gameControl.js"
import { useGameLogStore } from "@/stores/gameLog.js"


function generateGameBoardCells() {
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


function generatePerBoardWinnerTracker() {
  return Object.fromEntries(
      Object.keys(POSITIONS)
            .map(position => [position, EMPTY]))
}


export const useGameStateStore = defineStore(
  "gameState",
  () => {
    const cells = ref(generateGameBoardCells())
    const turn = ref(1)
    const winner = ref(EMPTY)
    const wonBoards = ref(generatePerBoardWinnerTracker())

    const toast = useToast()
    const gameLogStore = useGameLogStore()
    const gameControlStore = useGameControlStore()

    function _detectSingleBoardWinner(boardPosition, cellPosition = undefined) {
      console.debug(JSON.stringify({cellPosition, cells: cells.value[boardPosition]}))
      return findWinner(cells.value[boardPosition], cellPosition)
    }

    function _detectTt9BoardsWinner(singleBoardPosition = undefined) {
      console.debug(JSON.stringify({singleBoardPosition, boards: wonBoards.value}))
      return findWinner(wonBoards.value, singleBoardPosition)
    }

    async function _notifyWinnerAndRestartGame() {
      gameLogStore.recordEvent("Victory", winner.value)
      await new Promise((resolve) => {
        toast.success(
            `We have a winner: ${winner.value}!`,
            {onClose: () => { resolve() }})
      })

      gameControlStore.initGame()
    }

    async function endTurn(lastPlayedBoardPosition, lastPlayedCellPosition) {
      gameLogStore.recordEvent("endTurn", turn.value)

      const sbw = _detectSingleBoardWinner(lastPlayedBoardPosition, lastPlayedCellPosition)
      if (sbw !== EMPTY) {
        gameLogStore.recordEvent("boardSized", `${sbw} sized ${lastPlayedBoardPosition}`)
        wonBoards.value[lastPlayedBoardPosition] = sbw

        this.winner = _detectTt9BoardsWinner()
        if (this.winner !== EMPTY) {
          await _notifyWinnerAndRestartGame()
          return RESTART_GAME
        }
      }

      turn.value++
      gameLogStore.recordEvent("startTurn", turn.value)

      return CONTINUE_GAME
    }

    function initGame() {
      cells.value = generateGameBoardCells()
      turn.value = 1
      winner.value = EMPTY
      wonBoards.value = generatePerBoardWinnerTracker()

      gameLogStore.recordEvent("gameStart")
    }

    return {
      cells, turn, winner, wonBoards,
      initGame, endTurn
    }
  })
