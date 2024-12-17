<template>
  <!-- Main Header -->
  <div class="admin__header d-flex justify-sb align-center w-100 p-4">
    <div
      @click="toggleSidemenu"
      :class="{ shrinked: !isSidemenuOpened }"
      class="sidemenu-close d-flex align-center justify-center p-absolute"
    >
      <span class="material-symbols-outlined"> menu_open </span>
    </div>
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
    <!-- Language Picker -->
    <div :class="{ shrinked: !isSidemenuOpened }" class="admin__sidemenu p-absolute">
      <language-picker :isSaveButtonDisabled="isSaveButtonDisabled" @disable-save="onDisableSave" />
    </div>
    <div
      :class="{ shrinked: !isSidemenuOpened }"
      class="admin__tabs-wrapper d-flex-col p-relative w-100"
    >
      <!-- Tabs -->
      <div class="admin__tabs d-flex justify-sb align-center w-100 px-4 py-5">
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          :class="[
            'tab',
            {
              active: isSelectedTab(tab.label),
              'unsaved-changes': !isSaveButtonDisabled && tab.label === 'Content',
            },
          ]"
          @click="navigateTo(tab.route)"
          class="admin__tab-item d-flex align-center p-relative px-5 py-3"
        >
          <span class="text-bold-2 mr-2">{{ tab.label }}</span>
          <span class="material-symbols-outlined">{{ tab.icon }}</span>
        </div>
      </div>
      <!-- Content Header -->
      <div class="admin__save-button d-flex justify-sb align-center p-relative px-4">
        <div>
          Editing content for:
          <span class="language ml-1 px-2 py-1 text-bold-1">{{ language?.name }}</span>
        </div>
        <button
          :disabled="isSaveButtonDisabled"
          :class="{ disabled: isSaveButtonDisabled }"
          class="button button--ternary button--icon p-relative"
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
  <!-- Modal -->
  <div class="modal p-absolute w-100 h-100">
    <modal />
  </div>
  <!-- Notification -->
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
import type { Content, Language } from '../../types/content'
import LanguagePicker from './language-picker/LanguagePicker.vue'
import Modal from './shared/modal/Modal.vue'
import Notification from './shared/notification/Notification.vue'

export default defineComponent({
  components: { LanguagePicker, Modal, Notification },
  name: 'AdminPanel',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()
    const localizationStore = useLocalizationStore()

    const language = ref<Language>()
    const content = ref<Content>()
    const contentCopy = ref(Object.freeze({}))
    const isSaveButtonDisabled = ref(true)
    const isSidemenuOpened = ref(true)
    const activeTab = ref(0)
    const tabs = ref([
      { label: 'Content', icon: 'edit_square', route: '/admin/content' },
      { label: 'Videos', icon: 'movie', route: '/admin/videos' },
      { label: 'Articles', icon: 'clarify', route: '/admin/articles' },
      // { label: 'Photo Galleries', icon: 'photo_library', route: '/admin/galleries' },
      // { label: 'Artists', icon: 'music_note', route: '/admin/artists' },
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

      content.value = { ...(localizationStore.content as Content) }
      contentCopy.value = Object.freeze(JSON.parse(JSON.stringify(content.value)))
    }

    const updateContent = (updatedContent: Content) => {
      content.value = {
        ...content.value,
        ...updatedContent,
      }

      localizationStore.content = content.value

      if (deepEqual(content.value, contentCopy.value)) {
        isSaveButtonDisabled.value = true
      } else {
        isSaveButtonDisabled.value = false
      }
    }

    const saveContent = async () => {
      await localizationStore.saveLocalizationContent()

      contentCopy.value = Object.freeze(JSON.parse(JSON.stringify(content.value)))
      isSaveButtonDisabled.value = true
    }

    const onDisableSave = (value: boolean) => {
      isSaveButtonDisabled.value = value
    }

    const toggleSidemenu = () => {
      isSidemenuOpened.value = !isSidemenuOpened.value
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
      isSidemenuOpened,
      isSelectedTab,
      navigateTo,
      logout,
      goToWebsite,
      updateContent,
      saveContent,
      onDisableSave,
      toggleSidemenu,
    }
  },
})
// Handle image upload cancelation

// When updating a photo, delete the photo with the same id from ImbBB, and replace it with new photo
// Wnen deleting a photo, delete it from ImgBB as well (CORS?)

// When removing a language, that language isn't available in all languages array (until refresh)
</script>

<style lang="scss" scoped src="./AdminPanel.scss"></style>
