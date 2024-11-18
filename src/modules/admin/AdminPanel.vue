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
  <div class="d-flex">
    <div class="admin__sidemenu">
      <language-picker />
    </div>
    <div class="admin__tabs d-flex justify-sb align-center w-100 px-4 py-5">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        :class="[
          'admin__tab-item d-flex align-center p-relative px-5 py-3',
          { active: activeTab === index },
        ]"
        @click="setActiveTab(index)"
      >
        <span class="text-bold-2 mr-2">{{ tab.label }}</span>
        <span class="material-symbols-outlined">{{ tab.icon }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import LanguagePicker from './language-picker/LanguagePicker.vue'

export default defineComponent({
  components: { LanguagePicker },
  name: 'AdminPanel',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const activeTab = ref(0)
    const tabs = ref([
      { label: 'Content', icon: 'description' },
      { label: 'Video', icon: 'movie' },
      { label: 'Images', icon: 'image' },
      { label: 'Artists', icon: 'music_note' },
    ])

    const setActiveTab = (index: number) => {
      activeTab.value = index
    }

    const logout = async () => {
      await authStore.logout()
      router.push('/auth')
    }

    const goToWebsite = () => {
      router.push('/')
    }

    return {
      tabs,
      activeTab,
      setActiveTab,
      logout,
      goToWebsite,
    }
  },
})
</script>

<style lang="scss" scoped src="./AdminPanel.scss"></style>
