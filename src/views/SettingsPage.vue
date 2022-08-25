<template>
  <section id="settings">

    <fieldset>
      <legend>Color and theme</legend>
      <SettingsLightDarkMode/>
    </fieldset>

    <fieldset>
      <legend>Players and game mode</legend>
      <SettingsNumberOfLocalPlayers/>
    </fieldset>

  </section>
</template>



<script setup>
import SettingsLightDarkMode from "@/components/settings/SettingsLightDarkMode.vue"
import SettingsNumberOfLocalPlayers from "@/components/settings/SettingsNumberOfLocalPlayers.vue"
</script>



<style scoped>
</style>