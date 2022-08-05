<template>
  <NavigationBar></NavigationBar>
  <hr/>
  <router-view></router-view>
</template>



<script setup>
import { useDark } from "@vueuse/core"

import { LIGHT_DARK_MODE_OPTIONS } from "@/constants.js"

import NavigationBar from "@/components/game/NavigationBar.vue"

useDark(LIGHT_DARK_MODE_OPTIONS)
</script>



<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
