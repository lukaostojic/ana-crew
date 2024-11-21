import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  fetchLocalizationContent,
  updateLocalizationContent,
  addNewLanguageContent,
  deleteLanguageContent,
} from '../services/localization.service'
import type { Language } from '@/services/language.service'

export const useLocalizationStore = defineStore('localization', () => {
  const selectedLanguage = ref<Language | null>({ code: 'en', name: 'English' })
  const content = ref<Record<string, string>>({})

  const setLanguage = (language: Language) => {
    selectedLanguage.value = language
  }

  const loadLocalizationContent = async () => {
    if (selectedLanguage.value?.code) {
      const data = await fetchLocalizationContent(selectedLanguage.value.code)
      Object.assign(content.value, data)
    }
  }

  const saveLocalizationContent = async () => {
    if (selectedLanguage.value) {
      await updateLocalizationContent(selectedLanguage.value.code, { ...content.value })
    }
  }

  const addLanguageContent = async (languageCode: string) => {
    await addNewLanguageContent(languageCode)
  }

  const removeLanguageContent = async (language: Language) => {
    if (language.code) {
      await deleteLanguageContent(language.code)
      selectedLanguage.value = null
      Object.assign(content.value, {})
    }
  }

  return {
    selectedLanguage,
    content,
    setLanguage,
    loadLocalizationContent,
    saveLocalizationContent,
    addLanguageContent,
    removeLanguageContent,
  }
})
