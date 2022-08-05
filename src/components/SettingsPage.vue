<template>
  <section id="settings">

    <fieldset>
      <legend>Color and theme</legend>
      <button id="light-dark-toggler" @click="toggleDark()">
        Switch to {{ isDark ? "🌞 Light" : "🌙 Dark" }} mode
      </button>
    </fieldset>

    <fieldset>
      <legend>Players and game mode</legend>
      <div>
        <span>How many players are playing from this device?</span>
        &nbsp;
        <label for="one-player">{{ LOCAL_PLAYERS.onePlayer }}</label>
        <input type="radio"
               id="one-player"
               name="local-players"
               v-model="numberOfLocalPlayers"
               :value="LOCAL_PLAYERS.onePlayer">
        &nbsp;
        <label for="both-player">{{ LOCAL_PLAYERS.bothPlayers }}</label>
        <input type="radio"
               id="both-players"
               name="local-players"
               v-model="numberOfLocalPlayers"
               :value="LOCAL_PLAYERS.bothPlayers">
      </div>
      <div v-if="numberOfLocalPlayers === LOCAL_PLAYERS.onePlayer">
        <span>Is the non-local player a remote human player or an AI?</span>
        &nbsp;
        <label for="remote-human-opponent">{{ REMOTE_OPPONENT_TYPE.remoteHumanOpponent }}</label>
        <input type="radio"
               id="remote-human-opponent"
               name="non-local-opponent"
               v-model="nonLocalOpponentType"
               :value="REMOTE_OPPONENT_TYPE.remoteHumanOpponent">
        &nbsp;
        <label for="ai-opponent">{{ REMOTE_OPPONENT_TYPE.aiOpponent }}</label>
        <input type="radio"
               id="ai-opponent"
               name="non-local-opponent"
               v-model="nonLocalOpponentType"
               :value="REMOTE_OPPONENT_TYPE.aiOpponent">
      </div>
    </fieldset>

  </section>
</template>



<script setup>
import { useDark, useToggle, useStorage } from "@vueuse/core"

import {
  LIGHT_DARK_MODE_OPTIONS,
  LOCAL_PLAYERS, REMOTE_OPPONENT_TYPE
} from "@/constants.js"


const isDark = useDark(LIGHT_DARK_MODE_OPTIONS)
const toggleDark = useToggle(isDark)

const numberOfLocalPlayers = useStorage("number-of-local-players", LOCAL_PLAYERS.bothPlayers)
const nonLocalOpponentType = useStorage(
    "non-local-opponent",
    numberOfLocalPlayers.value === LOCAL_PLAYERS.bothPlayers
        ? undefined
        : REMOTE_OPPONENT_TYPE.aiOpponent)

/*
 * debug/development
 */
import { watch } from "vue"
import { useToast } from "vue-toastification"
const toast = useToast()
watch(numberOfLocalPlayers, newValue => {
  if (newValue === LOCAL_PLAYERS.onePlayer) {
    toast.error(`${newValue} mode not implemented yet!`)
  }
})
watch(nonLocalOpponentType, newValue => {
  toast.error(`${newValue} opponent not implemented yet!`)
})
</script>



<style scoped>
#light-dark-toggler {
  border-width: 1px;
  border-radius: 1ex;
}

.dark #light-dark-toggler {
  border-color: sienna;
  color: sienna;
  background-color: lightyellow;
}

.light #light-dark-toggler {
  border-color: lightblue;
  color: lightblue;
  background-color: #262626;
}
</style>