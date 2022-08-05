<template>
  <section id="game-board">
    <table>
      <tr v-for="(rowPositions, rowIndex) in POSITIONS_BY_ROW"
          :key="`row-${rowIndex}`">
        <td v-for="(boardPosition, cellIndex) in rowPositions"
            :key="`row-${rowIndex}-${cellIndex}`">
          <SingleBoard :board-position="boardPosition"/>
        </td>
      </tr>
    </table>
  </section>
</template>



<script setup>
import { POSITIONS_BY_ROW } from "@/lib/constants.js"

import SingleBoard from "@/components/game/SingleBoard.vue"
</script>



<style scoped>
</style>