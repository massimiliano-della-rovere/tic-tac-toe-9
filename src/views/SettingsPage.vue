<template>
  <section id="settings">

    <fieldset>
      <legend>Color and theme</legend>
      <SettingsLightDarkMode/>
    </fieldset>

    <fieldset>
      <legend>Players and game mode</legend>
      <SettingsNumberOfLocalPlayers/>
      <SettingsRemoteOpponentType/>
    </fieldset>

  </section>
</template>



<script setup>
import SettingsLightDarkMode from "@/components/settings/SettingsLightDarkMode.vue"
import SettingsNumberOfLocalPlayers from "@/components/settings/SettingsNumberOfLocalPlayers.vue"
import SettingsRemoteOpponentType from "@/components/settings/SettingsRemoteOpponentType.vue"
</script>



<style scoped>
</style>