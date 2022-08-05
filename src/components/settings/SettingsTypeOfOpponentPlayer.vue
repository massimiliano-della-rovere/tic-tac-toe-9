<template>
  <div v-if="numberOfLocalPlayers === LOCAL_PLAYERS.values.onePlayer">
    <span>Is the non-local player a remote human player or an AI?</span>
    &nbsp;
    <label for="remote-human-opponent">{{ REMOTE_OPPONENT_TYPE.values.remoteHumanOpponent }}</label>
    <input type="radio"
           id="remote-human-opponent"
           name="non-local-opponent"
           v-model="nonLocalOpponentType"
           :value="REMOTE_OPPONENT_TYPE.values.remoteHumanOpponent">
    &nbsp;
    <label for="ai-opponent">{{ REMOTE_OPPONENT_TYPE.values.aiOpponent }}</label>
    <input type="radio"
           id="ai-opponent"
           name="non-local-opponent"
           v-model="nonLocalOpponentType"
           :value="REMOTE_OPPONENT_TYPE.values.aiOpponent">
  </div>
</template>



<script setup>
import { useStorage } from "@vueuse/core"

import { LOCAL_PLAYERS, REMOTE_OPPONENT_TYPE } from "@/lib/constants.js"


const numberOfLocalPlayers = useStorage(
  LOCAL_PLAYERS.key,
  LOCAL_PLAYERS.defaultValue)
const nonLocalOpponentType = useStorage(
  REMOTE_OPPONENT_TYPE.key,
  numberOfLocalPlayers.value === LOCAL_PLAYERS.values.bothPlayers
    ? undefined
    : REMOTE_OPPONENT_TYPE.values.aiOpponent)


/*
 * debug/development
 */
import { watch } from "vue"
import { useToast } from "vue-toastification"
const toast = useToast()
// watch(numberOfLocalPlayers, newValue => {
//   if (newValue === LOCAL_PLAYERS.onePlayer) {
//     toast.error(`${newValue} mode not implemented yet!`)
//   }
// })
watch(nonLocalOpponentType, newValue => {
  toast.error(`${newValue} opponent not implemented yet!`)
})
</script>



<style scoped>
</style>