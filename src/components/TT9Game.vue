<template>
  <TT9Board/>
</template>



<script setup>
import { useGameControlStore } from "@/stores/gameControl.js"

import TT9Board from "@/components/TT9Board.vue"


useGameControlStore().initGame()
</script>



<style scoped>
</style>