<template>
  <div :id="cellID"
       :class="['cell-content', cellClass]"
       @click.prevent="markCellSymbol">
    {{ cellContent }}
  </div>
</template>



<script setup>
import { computed } from "vue"
import { useToast } from "vue-toastification"

import { EMPTY } from "@/constants.js"
import { cellContentToClass } from "@/utilities.js"

import { useGameControlStore } from "@/stores/gameControl.js"
import { useGameLogStore } from "@/stores/gameLog.js"
import { useGameStateStore } from "@/stores/gameState.js"


// eslint-disable-next-line no-undef
const props = defineProps({
  cellPosition: {
    type: String,
    required: true
  },
  boardPosition: {
    type: String,
    required: true
  }})


const cellID = computed(() => `cell-${props.boardPosition}-${props.cellPosition}`)
console.debug(`init ${cellID.value}`)


const toast = useToast()
const gameControlStore = useGameControlStore()
const gameLogStore = useGameLogStore()
const gameStateStore = useGameStateStore()


const cellContent = computed({
  get() {
    return gameStateStore.cells[props.boardPosition][props.cellPosition]
  },
  set(newValue) {
    gameStateStore.cells[props.boardPosition][props.cellPosition] = newValue
  }
})

const cellClass = computed(() => { return cellContentToClass(cellContent.value) });


async function markCellSymbol(event) {
  const cellID = event.target.id
  console.debug(`clicked ${cellID}`)

  if (cellContent.value !== EMPTY) {
    toast.error(`The clicked cell is already owned by ${cellContent.value}.`)
    return
  }

  // eslint-disable-next-line no-undef
  if (gameControlStore.activeBoards.length && !gameControlStore.activeBoards.includes(props.boardPosition)) {
    toast.error(`You can only select an empty cell in the ${gameControlStore.activeBoards} board.`)
    return
  }

  if (gameStateStore.wonBoards[props.boardPosition] !== EMPTY) {
    toast.error(`The board you clicked can't be used because was already won by ${gameStateStore.wonBoards[props.boardPosition]}.`)
    return
  }

  cellContent.value = gameControlStore.activePlayer
  gameLogStore.recordEvent("markCell", {cellID, owner: gameControlStore.activePlayer})
  console.debug(`${cellID} is owned by ${gameControlStore.activePlayer}`)
  console.debug(`next board(s): ${gameControlStore.activeBoards.join(", ")}`)
  await gameControlStore.endTurn(props.boardPosition, props.cellPosition)
}
</script>



<style scoped>
.cell-content {
  font-weight: bold;
  font-family: monospace;
  font-size: 3em;

  border-style: solid;
  border-width: 1px;
  padding: .3ex;
  height: 1.5em;
  width: 1.5em;

  display: grid;
  justify-content: center;
  align-items: center;

  transition: color 1s linear;
}

.dark .cell-content {
  border-color: gray;
}

.light .cell-content {
  border: black;
}

.dark .circle {
  color: rgba(255, 110, 110, 100%);
}

.dark .cross {
  color: rgba(110, 110, 255, 100%);
}

.dark .empty {
  color: darkgray;
}

.light .circle {
  color: rgba(255, 0, 0, 100%);
}

.light .cross {
  color: rgba(0, 0, 255, 100%);
}

.light .empty {
  color: lightgray;
}
</style>
