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
import SettingsLightDarkMode from "@/components/settings/SettingsLightDarkMode.vue"
import SettingsNumberOfLocalPlayers from "@/components/settings/SettingsNumberOfLocalPlayers.vue"
import SettingsTypeOfOpponentPlayer from "@/components/settings/SettingsTypeOfOpponentPlayer.vue"
</script>



<style scoped>
</style>