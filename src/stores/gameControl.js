import { ref } from "vue"
import { defineStore } from "pinia"
import { useToast } from "vue-toastification"

import {
  EMPTY, SYMBOLS,
  POSITIONS,
  RESTART_GAME, LOCAL_PLAYERS
} from "@/lib/constants.js"
import { swapActivePlayer } from "@/lib/utilities.js"

import { useGameLogStore } from "@/stores/gameLog.js"
import { useGameStateStore } from "@/stores/gameState.js"


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
    const nonLocalOpponentType = ref(undefined)
    const nonLocalOpponentSymbol = ref(undefined)

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

      activeBoards.value = Object.keys(POSITIONS)
      activePlayer.value = calculateStartingPlayer(startingPlayer)
      nonLocalOpponentSymbol.value = undefined
      gameLogStore.recordEvent("initActivePlayer", activePlayer.value)

      toast.info(`A new game is starting, first player is ${activePlayer.value}`)

      if (nonLocalOpponentSymbol.value === LOCAL_PLAYERS.onePlayer) {
        // TODO: this should be a real handshake with the remote client
        nonLocalOpponentSymbol.value = swapActivePlayer(activePlayer.value)
        if (nonLocalOpponentSymbol.value !== undefined) {
          gameLogStore.recordEvent("opponent", {type: nonLocalOpponentType, symbol: nonLocalOpponentSymbol})
          toast.info(`Opponent ${nonLocalOpponentSymbol.value} type is ${nonLocalOpponentType.value}`)
        }
      }
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
