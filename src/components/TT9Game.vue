<template>
  <TT9Board @load="notifyNewGame"/>
</template>



<script setup>
import TT9Board from "@/components/TT9Board.vue"
import { useGameStore } from "@/stores/game.js"

const gameStore = useGameStore()

gameStore.initGame()
</script>



<style scoped>
</style>