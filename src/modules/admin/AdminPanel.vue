<template>
  <div class="admin__header d-flex justify-sb align-center px-4 py-4 w-100">
    <h2>Admin Panel</h2>
    <div class="d-flex">
      <button @click="goToWebsite" class="button button--primary button--icon mr-2">
        <span>Go to Website</span><span class="material-symbols-outlined"> globe </span>
      </button>
      <button @click="logout" class="button button--primary button--icon">
        <span>Logout</span><span class="material-symbols-outlined"> logout </span>
      </button>
    </div>
  </div>
  <div class="admin__sidemenu">
    <language-picker />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { db } from '../../config/firebase'
import { collection, getDocs } from 'firebase/firestore'
import LanguagePicker from './language-picker/LanguagePicker.vue'

export default defineComponent({
  components: { LanguagePicker },
  name: 'AdminPanel',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    onMounted(async () => {})

    const logout = async () => {
      await authStore.logout()
      router.push('/auth')
    }

    const goToWebsite = () => {
      router.push('/')
    }

    return {
      logout,
      goToWebsite,
    }
  },
})
</script>

<style lang="scss" scoped src="./AdminPanel.scss"></style>
