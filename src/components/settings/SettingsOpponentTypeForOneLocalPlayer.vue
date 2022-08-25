<template>
  <div v-if="numberOfLocalPlayers === NUMBER_OF_LOCAL_PLAYERS.values.onePlayer">
    <span>Is the non-local player a remote human player or an AI?</span>
    &nbsp;
    <label for="remote-human-opponent">{{ OPPONENT_TYPE_FOR_ONE_LOCAL_PLAYER.values.remoteHumanOpponent }}</label>
    <input type="radio"
           id="remote-human-opponent"
           name="non-local-opponent"
           v-model="nonLocalOpponentType"
           :value="OPPONENT_TYPE_FOR_ONE_LOCAL_PLAYER.values.remoteHumanOpponent">
    &nbsp;
    <label for="ai-opponent">{{ OPPONENT_TYPE_FOR_ONE_LOCAL_PLAYER.values.aiOpponent }}</label>
    <input type="radio"
           id="ai-opponent"
           name="non-local-opponent"
           v-model="nonLocalOpponentType"
           :value="OPPONENT_TYPE_FOR_ONE_LOCAL_PLAYER.values.aiOpponent">
  </div>
  <SettingsAI/>
</template>



<script setup>
import { inject, provide } from "vue"
import { useLocalStorage } from "@vueuse/core"

import {
  NUMBER_OF_LOCAL_PLAYERS,
  OPPONENT_TYPE_FOR_ONE_LOCAL_PLAYER
} from "@/lib/constants/settings.js"

import SettingsAI from "@/components/settings/SettingsAI.vue"

const numberOfLocalPlayers = inject(NUMBER_OF_LOCAL_PLAYERS.key)
const nonLocalOpponentType = useLocalStorage(
  OPPONENT_TYPE_FOR_ONE_LOCAL_PLAYER.key,
  numberOfLocalPlayers.value === NUMBER_OF_LOCAL_PLAYERS.values.bothPlayers
    ? undefined
    : OPPONENT_TYPE_FOR_ONE_LOCAL_PLAYER.values.aiOpponent)
provide(OPPONENT_TYPE_FOR_ONE_LOCAL_PLAYER.key, nonLocalOpponentType)

/*
 * debug/development
 */
import { watch } from "vue"
import { useToast } from "vue-toastification"
const toast = useToast()
watch(nonLocalOpponentType, newValue => {
  toast.error(`${newValue} opponent not implemented yet!`)
})
</script>



<style scoped>
input[type="range"] {
  margin-left: 1ex;
  margin-right: 1ex;
  width: 40em;
}

input[type="range"] + span.value {
  font-family: monospace;
  font-size: larger;
  width: 2em;
}
</style>