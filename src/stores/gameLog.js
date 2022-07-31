import { ref } from "vue"
import { defineStore } from "pinia"


export const useGameLogStore = defineStore(
  "gameLog",
  () => {
    const history = ref([])

    function initGame() {
      history.value = []
    }

    function recordEvent(eventName, value = undefined) {
      const record = new Map([["event", eventName]])
      if (value !== null) {
        record.set("value", value)
      }
      this.history.push(record)
    }

    return {
      history,
      initGame, recordEvent
    }
  })
