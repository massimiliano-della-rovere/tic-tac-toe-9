import { ref } from "vue"
import { defineStore } from "pinia"
import { useToast } from "vue-toastification"

import {
  CIRCLE, CROSS, EMPTY, SYMBOLS,
  POSITIONS,
  RESTART_GAME } from "@/constants.js"
import { InvalidUserError } from "@/errors/InvalidUserError.js"

import { useGameLogStore } from "@/stores/gameLog.js"
import { useGameStateStore } from "@/stores/gameState.js"


function swapActivePlayer(currentActivePlayer) {
  switch (currentActivePlayer) {
    case CIRCLE:
      return CROSS
    case CROSS:
      return CIRCLE
    default:
      throw new InvalidUserError(currentActivePlayer)
    }
}


function generateRandomStartingPlayer() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
}


function calculateStartingPlayer(requestedStartingPlayer) {
  if (SYMBOLS.includes(requestedStartingPlayer)) {
    return requestedStartingPlayer
  } else {
    return generateRandomStartingPlayer()
  }
}


export const useGameControlStore = defineStore(
  "gameControl",
  () => {
    const activeBoards = ref(Object.keys(POSITIONS))
    const activePlayer = ref(EMPTY)

    const toast = useToast()
    const gameLogStore = useGameLogStore()
    const gameStateStore = useGameStateStore()

    function _calculateActiveBoards(lastPlayedCellPosition) {
      if (gameStateStore.wonBoards[lastPlayedCellPosition] === EMPTY) {
        return [lastPlayedCellPosition]
      } else {
        return Object.keys(POSITIONS)
                     .filter(position => gameStateStore.wonBoards[position] === EMPTY)
      }
    }

    function initGame(startingPlayer = EMPTY) {
      gameStateStore.initGame()

      console.log("PRE")
      activeBoards.value = Object.keys(POSITIONS)
      console.log({POSITIONS, activeBoards: activeBoards.value})
      console.log("POST")
      activePlayer.value = calculateStartingPlayer(startingPlayer)
      gameLogStore.recordEvent("initActivePlayer", activePlayer.value)

      toast.info(`A new game is starting, first player is ${activePlayer.value}`)
    }

    async function endTurn(lastPlayedBoardPosition, lastPlayedCellPosition) {
      const gameFate = await gameStateStore.endTurn(lastPlayedBoardPosition, lastPlayedCellPosition)
      if (gameFate === RESTART_GAME) {
        return
      }

      this.activePlayer = swapActivePlayer(activePlayer.value)
      gameLogStore.recordEvent("newActivePlayer", activePlayer.value)

      this.activeBoards = _calculateActiveBoards(lastPlayedCellPosition)
      gameLogStore.recordEvent("activeBoards", activeBoards.value)
    }

    return {
      activeBoards, activePlayer,
      initGame, endTurn
    }
  })
