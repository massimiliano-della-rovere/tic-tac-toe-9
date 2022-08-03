<template>
  <section id="settings">
    <fieldset>
      <legend>Color and theme</legend>
      <button id="light-dark-toggler" @click="toggleDark()">
        Switch to {{ isDark ? "🌞 Light" : "🌙 Dark" }} mode
      </button>
    </fieldset>
  </section>
</template>



<script setup>
import { useDark, useToggle } from "@vueuse/core"

import { LIGHT_DARK_MODE_OPTIONS } from "@/constants.js"


const isDark = useDark(LIGHT_DARK_MODE_OPTIONS)
const toggleDark = useToggle(isDark)
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