import { ref } from "vue"
import { defineStore } from "pinia"
import { useToast } from "vue-toastification"
import { useStorage } from "@vueuse/core"

import {
  EMPTY, SYMBOLS,
  POSITIONS,
  RESTART_GAME,
  NUMBER_OF_LOCAL_PLAYERS, OPPONENT_TYPE_FOR_ONE_LOCAL_PLAYER
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
    const numberOfLocalPlayers = useStorage(
        NUMBER_OF_LOCAL_PLAYERS.key,
        NUMBER_OF_LOCAL_PLAYERS.defaultValue)
    const opponentTypeForOneLocalPlayer = useStorage(
        OPPONENT_TYPE_FOR_ONE_LOCAL_PLAYER.key,
        OPPONENT_TYPE_FOR_ONE_LOCAL_PLAYER.defaultValue)
    const opponentSymbolForOneLocalPlayer = ref(undefined)

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
      // TODO: for remoteOpponent this must be coordinated with the other client
      activePlayer.value = calculateStartingPlayer(startingPlayer)
      opponentSymbolForOneLocalPlayer.value = undefined
      gameLogStore.recordEvent("initActivePlayer", activePlayer.value)

      toast.info(`A new game is starting, first player is ${activePlayer.value}`)

      if (numberOfLocalPlayers.value === NUMBER_OF_LOCAL_PLAYERS.values.onePlayer) {
        // TODO: this should be a real handshake with the remote client
        opponentSymbolForOneLocalPlayer.value = swapActivePlayer(activePlayer.value)
        if (opponentSymbolForOneLocalPlayer.value !== undefined) {
          gameLogStore.recordEvent(
              "opponent",
              {
                type: opponentTypeForOneLocalPlayer.value,
                symbol: opponentSymbolForOneLocalPlayer.value
              })
          toast.info(`${activePlayer.value} is local`)
          toast.info(`Opponent ${opponentSymbolForOneLocalPlayer.value} type is ${opponentTypeForOneLocalPlayer.value}`)
        }
      } else {
        toast.info(`Both ${SYMBOLS.join('and')} are local players`)
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
