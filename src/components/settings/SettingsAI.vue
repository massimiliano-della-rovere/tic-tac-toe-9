<template>
  <div v-if="showComponent">
    <label for="ai-deep">AI Depth</label>
    <input type="range"
           min="2"
           max="64"
           step="2"
           id="ai-depth"
           name="ai-depth"
           v-model="aiDepth">
    <span class="value">{{ aiDepth.toString().padStart(2, '&nbsp;') }}</span>
  </div>
</template>

<script setup>
import { computed, inject } from "vue"
import { useLocalStorage } from "@vueuse/core"

import {
  AI_DEPTH,
  NUMBER_OF_LOCAL_PLAYERS, OPPONENT_TYPE_FOR_ONE_LOCAL_PLAYER
} from "@/lib/constants/settings.js"


const numberOfLocalPlayers = inject(NUMBER_OF_LOCAL_PLAYERS.key)
const nonLocalOpponentType = inject(OPPONENT_TYPE_FOR_ONE_LOCAL_PLAYER.key)

const showComponent = computed(() =>
    numberOfLocalPlayers.value === NUMBER_OF_LOCAL_PLAYERS.values.onePlayer &&
    nonLocalOpponentType.value === OPPONENT_TYPE_FOR_ONE_LOCAL_PLAYER.values.aiOpponent)
const aiDepth = useLocalStorage(AI_DEPTH.key, AI_DEPTH.defaultValue)
</script>

<style scoped>

</style>