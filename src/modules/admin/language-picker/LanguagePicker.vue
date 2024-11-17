<template>
  <div class="dropdown-wrapper" ref="dropdown">
    <div class="dropdown-header" @click="toggleDropdown">
      <input
        type="text"
        placeholder="Search languages"
        v-model="searchQuery"
        class="dropdown-search"
      />
      <span class="material-symbols-outlined dropdown-arrow" :class="{ open: isOpen }">
        keyboard_arrow_up
      </span>
    </div>
    <ul v-if="isOpen" class="dropdown-list">
      <li
        v-for="language in filteredLanguages"
        :key="language.code"
        class="dropdown-item"
        @click="selectLanguage(language)"
      >
        {{ language.name }}
      </li>
    </ul>
    <div class="selected-languages">
      <h4>Selected Languages:</h4>
      <ul>
        <li v-for="language in selectedLanguages" :key="language.code">
          {{ language.name }}
        </li>
      </ul>
    </div>
    <div class="default-language">
      <h4>Default Language:</h4>
      <p>{{ defaultLanguage?.name || 'No default set' }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue'
import { languages } from '../../../config/languages'
import { db } from '../../../config/firebase'
import { getDoc, setDoc, doc } from 'firebase/firestore'

export default defineComponent({
  name: 'CustomLanguageDropdown',
  setup() {
    const isOpen = ref(false)
    const searchQuery = ref('')
    const dropdown = ref<HTMLElement | null>(null)
    const availableLanguages = ref([...languages])
    const selectedLanguages = ref<{ code: string; name: string }[]>([])
    const defaultLanguage = ref<{ code: string; name: string } | null>(null)

    const fetchLanguages = async () => {
      const langRef = doc(db, 'languages', 'selectedLanguages')
      const settingsRef = doc(db, 'settings', 'defaultLanguage')
      const langSnap = await getDoc(langRef)

      if (langSnap.exists()) {
        const data = langSnap.data()
        selectedLanguages.value = data?.selectedLanguages || []
        availableLanguages.value = availableLanguages.value.filter(
          (language) =>
            !selectedLanguages.value.some((selected) => selected.code === language.code),
        )
      } else {
        console.log('No selected languages found!')
      }

      const settingsSnap = await getDoc(settingsRef)
      if (settingsSnap.exists()) {
        const settingsData = settingsSnap.data() as { code: string; name: string }
        defaultLanguage.value = settingsData
      } else {
        console.log('No default language found!')
      }
    }

    const updateLanguagesInFirebase = async (
      selectedLanguages: { code: string; name: string }[],
    ) => {
      const langRef = doc(db, 'languages', 'selectedLanguages')
      await setDoc(langRef, { selectedLanguages })
    }

    const updateDefaultLanguageInFirebase = async (language: { code: string; name: string }) => {
      const settingsRef = doc(db, 'settings', 'defaultLanguage')
      await setDoc(settingsRef, { defaultLanguage: language })
    }

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value
    }

    const closeDropdown = (event: MouseEvent) => {
      if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
        isOpen.value = false
      }
    }

    const selectLanguage = async (language: { code: string; name: string }) => {
      if (!selectedLanguages.value.some((lang) => lang.code === language.code)) {
        selectedLanguages.value.push(language)
        availableLanguages.value = availableLanguages.value.filter((l) => l.code !== language.code)
        await updateLanguagesInFirebase(selectedLanguages.value)
        isOpen.value = false
        searchQuery.value = ''
      }
    }

    const filteredLanguages = computed(() =>
      availableLanguages.value
        .filter((language) => language.code !== defaultLanguage.value?.code)
        .filter((language) =>
          language.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
        ),
    )

    const setAsDefaultLanguage = async (language: { code: string; name: string }) => {
      defaultLanguage.value = language
      await updateDefaultLanguageInFirebase(language)
    }

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
      toggleDropdown,
      selectLanguage,
      filteredLanguages,
      selectedLanguages,
      defaultLanguage,
      dropdown,
      setAsDefaultLanguage,
    }
  },
})
</script>

<style lang="scss" scoped src="./LanguagePicker.scss"></style>
