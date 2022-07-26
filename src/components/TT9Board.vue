<template>
  <table>
    <tr v-for="(rowPositions, rowIndex) in POSITIONS_BY_ROW"
        :key="`row-${rowIndex}`">
      <td v-for="(boardPosition, cellIndex) in rowPositions"
          :key="`row-${rowIndex}-${cellIndex}`">
        <SingleBoard :board-position="boardPosition"/>
      </td>
    </tr>
  </table>
</template>



<script setup>
import { POSITIONS_BY_ROW } from "@/constants.js"
import SingleBoard from "@/components/SingleBoard.vue"
</script>



<style scoped>
</style>