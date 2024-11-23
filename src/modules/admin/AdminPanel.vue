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
      <!-- Language Picker -->
      <language-picker @disable-save="onDisableSave" />
    </div>
    <div class="d-flex-col w-100">
      <!-- Tabs -->
      <div class="admin__tabs d-flex justify-sb align-center w-100 px-4 py-5">
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          :class="['tab', { active: isSelectedTab(tab.label) }]"
          @click="navigateTo(tab.route)"
          class="admin__tab-item d-flex align-center p-relative px-5 py-3"
        >
          <span class="text-bold-2 mr-2">{{ tab.label }}</span>
          <span class="material-symbols-outlined">{{ tab.icon }}</span>
        </div>
      </div>
      <!-- Header -->
      <div class="admin__save-button d-flex justify-sb align-center p-relative px-4">
        <div>
          Editing content for:
          <span class="language ml-1 px-2 py-1 text-bold-1">{{ language.name }}</span>
        </div>
        <button
          :disabled="isSaveButtonDisabled"
          :class="{ disabled: isSaveButtonDisabled }"
          class="button button--primary button--icon p-relative"
          @click="saveContent()"
        >
          <span>Save</span>
          <span class="material-symbols-outlined"> save </span>
        </button>
      </div>
      <!-- Router View -->
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" :content="content" @update-content="updateContent" />
        </keep-alive>
      </router-view>
    </div>
  </div>
  <!-- <div class="modal p-absolute w-100 h-100">
    <modal />
  </div> -->
  <div class="notification p-absolute">
    <notification />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useLocalizationStore } from '../../stores/localization'
import { deepEqual } from '../../helpers/helper-functions'
import type { Video } from '../../types/content'
import LanguagePicker from './language-picker/LanguagePicker.vue'
import Modal from './shared/modal/Modal.vue'
import Notification from './shared/notification/Notification.vue'

export default defineComponent({
  components: { LanguagePicker, Modal, Notification },
  name: 'Admin Panel',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()
    const localizationStore = useLocalizationStore()
    const language = ref()
    const content = ref()
    const contentCopy = ref(Object.freeze({}))
    const isSaveButtonDisabled = ref(true)
    const activeTab = ref(0)
    const tabs = ref([
      { label: 'Content', icon: 'description', route: '/admin/content' },
      { label: 'Videos', icon: 'movie', route: '/admin/videos' },
      { label: 'Photo Galleries', icon: 'photo_library', route: '/admin/galleries' },
      { label: 'Artists', icon: 'music_note', route: '/admin/artists' },
    ])

    const isSelectedTab = (tabName: string) => {
      return route.name === tabName
    }

    const navigateTo = (path: string) => {
      router.push(path)
    }

    const logout = async () => {
      await authStore.logout()
      router.push('/auth')
    }

    const goToWebsite = () => {
      router.push('/')
    }

    const fetchContent = async () => {
      await localizationStore.loadLocalizationContent()
      content.value = { ...localizationStore.content }
      contentCopy.value = Object.freeze(JSON.parse(JSON.stringify(content.value)))
    }

    const updateContent = (updatedContent: any) => {
      const hasEmptyUrl =
        Array.isArray(updatedContent.videos) &&
        updatedContent.videos.some((video: any) => !video.url || video.url.trim() === '')

      content.value = {
        ...content.value,
        ...updatedContent,
      }

      isSaveButtonDisabled.value = hasEmptyUrl || deepEqual(content.value, contentCopy.value)
    }

    const saveContent = async () => {
      const currentLanguage = localizationStore.selectedLanguage?.code

      localizationStore.content = {
        ...content.value,
        videos: Array.isArray(content.value.videos) ? content.value.videos : [],
      }

      localizationStore.videoContent = (
        Array.isArray(content.value.videos) ? content.value.videos : []
      ).map((video: Video) => video.url)

      await localizationStore.saveLocalizationContent()

      if (currentLanguage) {
        await localizationStore.saveVideoContent(currentLanguage)
      }

      contentCopy.value = Object.freeze(JSON.parse(JSON.stringify(content.value)))
      isSaveButtonDisabled.value = true
    }

    const onDisableSave = (value: boolean) => {
      isSaveButtonDisabled.value = value
    }

    watch(
      () => localizationStore.selectedLanguage,
      () => {
        fetchContent()
        language.value = localizationStore.selectedLanguage
      },
      { deep: true, immediate: true },
    )

    return {
      tabs,
      activeTab,
      language,
      content,
      isSaveButtonDisabled,
      isSelectedTab,
      navigateTo,
      logout,
      goToWebsite,
      updateContent,
      saveContent,
      onDisableSave,
    }
  },
})

// Optimize service - update videos only if video is added
// Set videos placeholder on new language addition (prevent populating video data with the data from the selected language)
// When changing url in one language, video data gets deleted in all other languages (url is updated properly)
// When removing a language, that language isn't available in all languages array (until refresh)

// Implement Quill editor for About Us section
</script>

<style lang="scss" scoped src="./AdminPanel.scss"></style>
