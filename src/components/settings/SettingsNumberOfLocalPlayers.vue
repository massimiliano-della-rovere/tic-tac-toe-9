<template>
  <div>
    <span>How many players are playing from this device?</span>
    &nbsp;
    <label for="one-player">{{ NUMBER_OF_LOCAL_PLAYERS.values.onePlayer }}</label>
    <input type="radio"
           id="one-player"
           name="local-players"
           v-model="numberOfLocalPlayers"
           :value="NUMBER_OF_LOCAL_PLAYERS.values.onePlayer">
    &nbsp;
    <label for="both-player">{{ NUMBER_OF_LOCAL_PLAYERS.values.bothPlayers }}</label>
    <input type="radio"
           id="both-players"
           name="local-players"
           v-model="numberOfLocalPlayers"
           :value="NUMBER_OF_LOCAL_PLAYERS.values.bothPlayers">
  </div>
</template>



<script setup>
import { useStorage } from "@vueuse/core"

import { NUMBER_OF_LOCAL_PLAYERS } from "@/lib/constants.js"


const numberOfLocalPlayers = useStorage(
  NUMBER_OF_LOCAL_PLAYERS.key,
  NUMBER_OF_LOCAL_PLAYERS.defaultValue)

/*
 * debug/development
 */
import { watch } from "vue"
import { useToast } from "vue-toastification"
const toast = useToast()
watch(numberOfLocalPlayers, newValue => {
  if (newValue === NUMBER_OF_LOCAL_PLAYERS.values.onePlayer) {
    toast.error(`${newValue} mode not implemented yet!`)
  }
})
</script>



<style scoped>
</style>