<template>
  <NavigationBar></NavigationBar>
  <hr/>
<!--  <section id="main" :style="{cursor: cursorStyle}">-->
  <section id="main">
    <router-view></router-view>
  </section>
</template>



<script setup>
// import { computed, watch } from "vue"
// import { storeToRefs } from "pinia"

import { useDark } from "@vueuse/core"

import { LIGHT_DARK_MODE_OPTIONS } from "@/lib/constants/settings.js"
// import { useGameControlStore} from "@/stores/gameControl.js"

import NavigationBar from "@/components/game/NavigationBar.vue"

useDark(LIGHT_DARK_MODE_OPTIONS)

// const { aiPlaying } = storeToRefs(useGameControlStore())
// console.log(aiPlaying.value)
// const cursorStyle = computed(() => aiPlaying.value ? "wait" : "auto")
// watch(
//     aiPlaying.value,
//     newValue => { console.info(newValue) })
</script>



<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
