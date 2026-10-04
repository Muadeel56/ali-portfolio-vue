import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initAnalytics, trackEnquireClicks } from './composables/useAnalytics.js'
import './assets/main.css'

createApp(App).use(router).mount('#app')

initAnalytics()
trackEnquireClicks()
