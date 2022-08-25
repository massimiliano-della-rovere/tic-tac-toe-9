<template>
  <table :id="boardID"
         :class="['single-board', activeClass, wonClass]">
    <tr v-for="(rowPositions, rowIndex) in POSITIONS_BY_ROW"
        :key="`row-${rowIndex}`">
      <td v-for="(cellPosition, cellIndex) in rowPositions"
          :key="`row-${rowIndex}-${cellIndex}`">
        <BoardCell :board-position="boardPosition"
                   :cell-position="cellPosition"/>
      </td>
    </tr>
  </table>
</template>



<script setup>
import { computed } from "vue"

import { CIRCLE, EMPTY } from "@/lib/constants/content.js"
import { POSITIONS_BY_ROW } from "@/lib/constants/position.js"

import { useGameControlStore } from "@/stores/gameControl.js"
import { useGameStateStore } from "@/stores/gameState.js"

import BoardCell from "@/components/game/BoardCell.vue"


const gameControlStore = useGameControlStore()
const gameStateStore = useGameStateStore()


// eslint-disable-next-line no-undef
const props = defineProps({
  boardPosition: {
    type: String,
    required: true
  }
})
const boardID = computed(() => `board-${props.boardPosition}`)
console.debug(`init ${boardID.value}`)


const activeClass = computed(() => {
  return gameControlStore.activeBoards.includes(props.boardPosition)
      ? `active-board-${gameControlStore.activePlayer === CIRCLE ? "circle" : "cross"}`
      : "forbidden-board"
})
const wonClass = computed(() => {
  const boardWinner = gameStateStore.wonBoards[props.boardPosition]
  console.debug(boardWinner)
  if (boardWinner === EMPTY) {
    return ""
  } else {
    return `won-by-${boardWinner === CIRCLE ? "circle" : "cross"}`
  }
})
</script>



<style scoped>
.single-board {
  transition: border 1s linear, background-color 1s ease-in-out;
  border-radius: 3ex;
}

.forbidden-board {
  border: thick transparent solid;
}

.dark .active-board-circle {
  border: thick rgba(255, 110, 110, 100%) solid;
}

.dark .active-board-cross {
  border: thick rgba(110, 110, 255, 100%) solid;
}


.dark .won-by-circle {
  background-color: rgba(255, 110, 110, 50%);
}

.dark .won-by-cross {
  background-color: rgba(110, 110, 255, 50%);
}

.light .active-board-circle {
  border: thick rgba(255, 0, 0, 100%) solid;
}

.light .active-board-cross {
  border: thick rgba(0, 0, 255, 100%) solid;
}


.light .won-by-circle {
  background-color: rgba(255, 0, 0, 50%);
}

.light .won-by-cross {
  background-color: rgba(0, 0, 255, 50%);
}
</style>