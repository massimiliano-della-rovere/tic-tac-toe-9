<template>
  <section id="log-scroller">
    <TransitionGroup name="events" tag="ul">
      <li v-for="event in lastEvents" :key="event.split('.')[0]">
        {{ event }}
      </li>
    </TransitionGroup>
  </section>
</template>



<script setup>
import { computed } from "vue"

import { useGameLogStore } from "@/stores/gameLog.js"


// eslint-disable-next-line no-undef
const props = defineProps({
  lines: {
    type: Number,
    required: true
  }
})


const gameLogStore = useGameLogStore()
const lastEvents = computed(
    () => gameLogStore.history
        .map((event, index) => [index, event])
        .slice(-props.lines)
        .map(([index, event]) => `${index}. ${event.get("event")}: ${JSON.stringify(event.get("value", undefined) ?? "-")}`)
        .reverse())
</script>



<style scoped>
.events-move, .events-enter-active, .events-leave-active {
  transition: all 1.5s ease;
}

.events-enter-from, .events-leave-to {
  opacity: 0;
  transform: translate(30px);
}

.events-leave-active {
  position: absolute;
}
</style>