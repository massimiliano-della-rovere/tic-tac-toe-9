import { createApp } from "vue"
import { createRouter, createWebHashHistory } from "vue-router"
import { createPinia } from "pinia"

import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"

import App from "@/App.vue"
import Home from "@/components/HomePage.vue"
import Settings from "@/components/SettingsPage.vue"
import Rules from "@/components/RulesManual.vue"
import TT9Game from "@/components/TT9Game.vue"


const routes = [
  {path: "/", component: Home},
  {path: "/game", component: TT9Game},
  {path: "/rules", component: Rules},
  {path: "/settings", component: Settings}
]
const router = createRouter({
  history: createWebHashHistory(),
  routes})

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(Toast)

app.mount("#app")
