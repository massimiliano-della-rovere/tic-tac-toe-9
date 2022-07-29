import { createApp } from "vue"
import { createPinia } from "pinia"
import Toast from "vue-toastification"
import App from "./App.vue"
import { useGameStore } from "@/stores/game.js"
import "vue-toastification/dist/index.css"


const pinia = createPinia()

const app = createApp(App)

app.use(pinia)
app.use(Toast)

useGameStore()

app.mount("#app")
