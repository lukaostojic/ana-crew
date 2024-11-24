import './styles/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

app.component('QuillEditor', QuillEditor)

const authStore = useAuthStore(pinia)
await authStore.fetchUser()

app.use(router)
app.mount('#app')
