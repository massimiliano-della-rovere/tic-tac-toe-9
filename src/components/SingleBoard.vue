<template>
  <table :id="boardID"
         :class="[activeClass, wonClass]">
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
import { CIRCLE, EMPTY, POSITIONS_BY_ROW } from "@/constants.js"
import { useGameStore } from "@/stores/game.js"
import BoardCell from "@/components/BoardCell.vue"


const gameStore = useGameStore()


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
  return gameStore.activeBoards.includes(props.boardPosition)
      ? `active-board-${gameStore.activePlayer === CIRCLE ? "circle" : "cross"}`
      : "forbidden-board"
})
const wonClass = computed(() => {
  console.debug({boardPosition: props.boardPosition, wonBoards: gameStore.wonBoards})
  const boardWinner = gameStore.wonBoards[props.boardPosition]
  console.debug(boardWinner)
  if (boardWinner === EMPTY) {
    return ""
  } else {
    return `won-by-${boardWinner === CIRCLE ? "circle" : "cross"}`
  }
})
</script>



<style scoped>
.active-board-circle {
  border: thick rgba(255, 0, 0, 100%) solid;
}

.active-board-cross {
  border: thick rgba(0, 0, 255, 100%) solid;
}

.forbidden-board {
  border: thick white solid;
}

.won-by-circle {
  background-color: rgba(255, 0, 0, 50%);
}

.won-by-cross {
  background-color: rgba(0, 0, 255, 50%);
}
</style>