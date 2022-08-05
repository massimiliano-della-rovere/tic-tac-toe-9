<template>
  <TT9Board/>
  <hr/>
  <LogScroller :lines="5"/>
</template>



<script setup>
import { useGameControlStore } from "@/stores/gameControl.js"

import LogScroller from "@/components/game/LogScroller.vue"
import TT9Board from "@/components/game/TT9Board.vue"


useGameControlStore().initGame()
</script>



<style scoped>
</style>