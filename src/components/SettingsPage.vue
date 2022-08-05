<template>
  <section id="settings">

    <fieldset>
      <legend>Color and theme</legend>
      <SettingsLightDarkMode/>
    </fieldset>

    <fieldset>
      <legend>Players and game mode</legend>
      <SettingsNumberOfLocalPlayers/>
      <SettingsTypeOfOpponentPlayer/>
    </fieldset>

  </section>
</template>



<script setup>
import SettingsLightDarkMode from "@/components/SettingsLightDarkMode.vue"
import SettingsNumberOfLocalPlayers from "@/components/SettingsNumberOfLocalPlayers.vue"
import SettingsTypeOfOpponentPlayer from "@/components/SettingsTypeOfOpponentPlayer.vue"
</script>



<style scoped>
</style>