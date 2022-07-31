<template>
  <TT9Board/>
  <hr/>
  <LogScroller :lines="5"/>
</template>



<script setup>
import { useGameControlStore } from "@/stores/gameControl.js"

import LogScroller from "@/components/LogScroller.vue"
import TT9Board from "@/components/TT9Board.vue"


useGameControlStore().initGame()
</script>



<style scoped>
</style>