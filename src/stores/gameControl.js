import { nextTick, ref } from "vue"
import { defineStore } from "pinia"
import { useToast } from "vue-toastification"
import { useLocalStorage } from "@vueuse/core"

import { EMPTY, SYMBOLS } from "@/lib/constants/content.js"
import { POSITIONS } from "@/lib/constants/position.js"
import { RESTART_GAME } from "@/lib/constants/matchFlow.js"
import {
  AI_DEPTH, NUMBER_OF_LOCAL_PLAYERS, OPPONENT_TYPE_FOR_ONE_LOCAL_PLAYER
} from "@/lib/constants/settings.js"
import { takeEmpty } from "@/lib/utilities.js"
import { otherPlayer } from "@/lib/gameLogic.js"

import { useGameLogStore } from "@/stores/gameLog.js"
import { useGameStateStore } from "@/stores/gameState.js"

import { aiTurn } from "@/lib/aiLogic.js"


function generateRandomStartingPlayer() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
}


function calculateStartingPlayer(requestedStartingPlayer) {
  return SYMBOLS.includes(requestedStartingPlayer)
    ? requestedStartingPlayer
    : generateRandomStartingPlayer()
}


export const useGameControlStore = defineStore(
  "gameControl",
  () => {
    const activeBoards = ref(Object.keys(POSITIONS))
    const activePlayer = ref(EMPTY)
    const numberOfLocalPlayers = useLocalStorage(
        NUMBER_OF_LOCAL_PLAYERS.key,
        NUMBER_OF_LOCAL_PLAYERS.defaultValue)
    const opponentTypeForOneLocalPlayer = useLocalStorage(
        OPPONENT_TYPE_FOR_ONE_LOCAL_PLAYER.key,
        OPPONENT_TYPE_FOR_ONE_LOCAL_PLAYER.defaultValue)
    const aiDepth = useLocalStorage(AI_DEPTH.key, AI_DEPTH.defaultValue)
    // const aiPlaying = ref(false)
    const opponentSymbolForOneLocalPlayer = ref(undefined)

    const toast = useToast()
    const gameLogStore = useGameLogStore()
    const gameStateStore = useGameStateStore()

    function _calculateActiveBoards(lastPlayedCellPosition) {
      return gameStateStore.wonBoards[lastPlayedCellPosition] === EMPTY
        ? [lastPlayedCellPosition]
        : takeEmpty(Object.keys(POSITIONS), gameStateStore.wonBoards)
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
        opponentSymbolForOneLocalPlayer.value = otherPlayer(activePlayer.value)
        if (opponentSymbolForOneLocalPlayer.value !== undefined) {
          gameLogStore.recordEvent(
              "opponent",
              {
                type: opponentTypeForOneLocalPlayer.value,
                symbol: opponentSymbolForOneLocalPlayer.value
              })
          toast.info(`${activePlayer.value} is local`)
          toast.info(`Opponent ${opponentSymbolForOneLocalPlayer.value} type is ${opponentTypeForOneLocalPlayer.value}`)
          if (opponentTypeForOneLocalPlayer.value === OPPONENT_TYPE_FOR_ONE_LOCAL_PLAYER.values.aiOpponent) {
            toast.info(`AI Depth is ${aiDepth.value}`)
          }
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

      this.activePlayer = otherPlayer(activePlayer.value)
      gameLogStore.recordEvent("newActivePlayer", activePlayer.value)

      this.activeBoards = _calculateActiveBoards(lastPlayedCellPosition)
      gameLogStore.recordEvent("activeBoards", activeBoards.value)

      console.info({
        activePlayer: activePlayer.value,
        numberOfLocalPlayers: numberOfLocalPlayers.value,
        opponentTypeForOneLocalPlayer: opponentTypeForOneLocalPlayer.value,
        opponentSymbolForOneLocalPlayer: opponentSymbolForOneLocalPlayer.value})
      if (numberOfLocalPlayers.value === NUMBER_OF_LOCAL_PLAYERS.values.onePlayer) {
        if (opponentTypeForOneLocalPlayer.value === OPPONENT_TYPE_FOR_ONE_LOCAL_PLAYER.values.aiOpponent
            && activePlayer.value === opponentSymbolForOneLocalPlayer.value) {
          const parameters = {
            activePlayer: this.activePlayer,
            cells: JSON.parse(JSON.stringify(gameStateStore.cells)),  // deep clone
            activeBoards: Array.from(this.activeBoards),
            wonBoards: Object.create(gameStateStore.wonBoards),
            aiDepth: this.aiDepth
          }
          console.info("aiTurn", parameters)
          await nextTick()
          await aiTurn(parameters, gameStateStore, this, gameLogStore)
        }
      }
    }

    return {
      activeBoards, activePlayer, opponentSymbolForOneLocalPlayer,
      initGame, endTurn,
      aiDepth //, aiPlaying
    }
  })
