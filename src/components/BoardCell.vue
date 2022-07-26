<template>
  <div :id="cellID"
       :class="['cell-content', cellClass]"
       @click.prevent="markCellSymbol">
    {{ cellContent }}
  </div>
</template>



<script setup>
import { computed } from "vue"
import { EMPTY } from "@/constants.js"
import { cellContentToClass } from "@/utilities.js"
import { useGameStore } from "@/stores/game.js"

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

const gameStore = useGameStore()

const cellContent = computed({
  get() {
    return gameStore.cells[props.boardPosition][props.cellPosition]
  },
  set(newValue) {
    gameStore.cells[props.boardPosition][props.cellPosition] = newValue
  }
})

const cellClass = computed(() => { return cellContentToClass(cellContent.value) });


function markCellSymbol(event) {
  const cellID = event.target.id
  console.debug(`clicked ${cellID}`)

  if (cellContent.value !== EMPTY) {
    alert(`The clicked cell is already owned by ${cellContent.value}.`)
    return
  }

  if (gameStore.activeBoards.length && !gameStore.activeBoards.includes(props.boardPosition)) {
    alert(`You can only select an empty cell in the ${gameStore.activeBoards} board.`)
    return
  }

  if (gameStore.wonBoards[props.boardPosition] !== EMPTY) {
    alert(`The board you clicked can't be used because was already won by ${gameStore.wonBoards[props.boardPosition]}.`)
    return
  }

  cellContent.value = gameStore.activePlayer
  gameStore.recordEvent("markCell", {cellID, owner: gameStore.activePlayer})
  console.debug(`${cellID} is owned by ${gameStore.activePlayer}`)
  console.debug(`next board(s): ${gameStore.activeBoards.join(", ")}`)
  gameStore.endTurn(props.boardPosition, props.cellPosition)
  console.info({cellContent, cells: gameStore.cells[props.boardPosition]})
}
</script>



<style scoped>
.cell-content {
  font-weight: bold;
  font-family: monospace;
  font-size: 3em;

  border: 1px black solid;
  padding: .3ex;
  height: 1.5em;
  width: 1.5em;

  /*display: table-cell;*/
  /*vertical-align: middle;*/
  /*text-align: center;*/
  display: flex;
  justify-content: center;
  align-items: center;
}

.circle {
  color: rgba(255, 0, 0, 100%);
}

.cross {
  color: rgba(0, 0, 255, 100%);
}

.empty {
  color: lightgray;
}
</style>
