<template>
  <div v-show="!isLoading" class="dropdown__wrapper p-relative h-100 p-4" ref="dropdown">
    <div class="dropdown__header d-flex justify-sb align-center" @click="toggleDropdown">
      <input
        type="text"
        placeholder="Search all languages"
        v-model="searchQuery"
        class="dropdown__search input w-100"
      />
      <span class="material-symbols-outlined dropdown-arrow" :class="{ open: isOpen }">
        keyboard_arrow_up
      </span>
    </div>
    <ul v-if="isOpen" class="dropdown__list p-absolute">
      <li
        v-for="language in filteredLanguages"
        :key="language.code"
        class="dropdown__item p-3"
        @click="selectLanguage(language)"
      >
        {{ language.name }}
      </li>
    </ul>
    <div class="selected-languages__list mt-5" :class="{ blured: isOpen }">
      <h4>Selected Languages</h4>
      <ul>
        <li
          v-if="defaultLanguage"
          class="selected-languages__item d-flex align-center justify-sb p-2 my-2"
          :class="{ selected: isSelectedLanguage(defaultLanguage) }"
          @click="handleLanguageClick(defaultLanguage)"
        >
          <span>{{ defaultLanguage?.name || 'No default set' }} - Default</span>
          <span class="material-symbols-outlined default-icon"> lock </span>
        </li>
        <li
          class="selected-languages__item d-flex align-center justify-sb p-2 mb-2"
          v-for="language in selectedLanguages"
          :key="language.code"
          :class="{ selected: isSelectedLanguage(language) }"
          @click="handleLanguageClick(language)"
        >
          <span>{{ language.name }}</span>
          <span class="material-symbols-outlined delete-icon" @click="deleteLanguage(language)">
            delete
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div class="dropdown__loader h-100 d-flex justify-center align-center" v-show="isLoading">
    <img src="../../../assets/loading.gif" alt="loader" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue'
import {
  fetchSelectedLanguages,
  fetchDefaultLanguage,
  updateSelectedLanguages,
  deleteSelectedLanguage,
} from '../../../services/localization.service'
import { languages as allLanguages } from '../../../config/languages'

export default defineComponent({
  name: 'CustomLanguageDropdown',
  setup() {
    const isOpen = ref(false)
    const searchQuery = ref('')
    const dropdown = ref<HTMLElement | null>(null)
    const availableLanguages = ref([...allLanguages])
    const selectedLanguages = ref<{ code: string; name: string }[]>([])
    const defaultLanguage = ref<{ code: string; name: string } | null>(null)
    const selectedLanguage = ref<{ code: string; name: string } | null>(null)
    const isLoading = ref(true)

    const fetchLanguages = async () => {
      try {
        const [selected, defaultLang] = await Promise.all([
          fetchSelectedLanguages(),
          fetchDefaultLanguage(),
        ])

        selectedLanguages.value = selected
        defaultLanguage.value = defaultLang
        availableLanguages.value = allLanguages.filter(
          (language) =>
            !selected.some((selected) => selected.code === language.code) &&
            language.code !== defaultLang?.code,
        )
        selectedLanguage.value = defaultLanguage.value
      } catch (error) {
        console.error('Error fetching languages:', error)
      } finally {
        isLoading.value = false
      }
    }

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value
    }

    const closeDropdown = (event: MouseEvent) => {
      if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
        isOpen.value = false
        searchQuery.value = ''
      }
    }

    const handleLanguageClick = (language: { code: string; name: string }) => {
      selectedLanguage.value = language
    }

    const isSelectedLanguage = (language: { code: string; name: string }) => {
      return selectedLanguage.value?.code === language.code
    }

    const deleteLanguage = async (language: { code: string; name: string }) => {
      try {
        selectedLanguages.value = selectedLanguages.value.filter(
          (selected) => selected.code !== language.code,
        )

        availableLanguages.value.push(language)
        await deleteSelectedLanguage(language)
      } catch (error) {
        console.error('Error deleting language:', error)
      }
    }

    const selectLanguage = async (language: { code: string; name: string }) => {
      if (!selectedLanguages.value.some((lang) => lang.code === language.code)) {
        selectedLanguages.value.push(language)
        availableLanguages.value = availableLanguages.value.filter((l) => l.code !== language.code)
        await updateSelectedLanguages(selectedLanguages.value)
        isOpen.value = false
        searchQuery.value = ''
      }
    }

    const filteredLanguages = computed(() =>
      availableLanguages.value.filter((language) =>
        language.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
      ),
    )

    onMounted(() => {
      fetchLanguages()
      document.addEventListener('click', closeDropdown)
    })

    onUnmounted(() => {
      document.removeEventListener('click', closeDropdown)
    })

    return {
      isOpen,
      searchQuery,
      filteredLanguages,
      selectedLanguages,
      defaultLanguage,
      dropdown,
      isLoading,
      toggleDropdown,
      selectLanguage,
      handleLanguageClick,
      isSelectedLanguage,
      deleteLanguage,
    }
  },
})
</script>

<style lang="scss" scoped src="./LanguagePicker.scss"></style>
