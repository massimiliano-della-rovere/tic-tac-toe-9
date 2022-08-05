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
</template>



<script setup>
import { useStorage } from "@vueuse/core"

import { NUMBER_OF_LOCAL_PLAYERS, OPPONENT_TYPE_FOR_ONE_LOCAL_PLAYER } from "@/lib/constants.js"


const numberOfLocalPlayers = useStorage(
  NUMBER_OF_LOCAL_PLAYERS.key,
  NUMBER_OF_LOCAL_PLAYERS.defaultValue)
const nonLocalOpponentType = useStorage(
    OPPONENT_TYPE_FOR_ONE_LOCAL_PLAYER.key,
  numberOfLocalPlayers.value === NUMBER_OF_LOCAL_PLAYERS.values.bothPlayers
    ? undefined
    : OPPONENT_TYPE_FOR_ONE_LOCAL_PLAYER.values.aiOpponent)


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