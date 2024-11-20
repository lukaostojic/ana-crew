import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import {
  fetchLocalizationContent,
  updateLocalizationContent,
  addNewLanguageContent,
  deleteLanguageContent,
} from '../services/localization.service'
import type { Language } from '@/services/language.service'

export const useLocalizationStore = defineStore('localization', () => {
  const selectedLanguage = ref<Language | null>({ code: 'en', name: 'English' })
  const content = reactive<Record<string, string>>({})

  const setLanguage = (language: Language) => {
    selectedLanguage.value = language
  }

  const loadLocalizationContent = async () => {
    if (selectedLanguage.value?.code) {
      const data = await fetchLocalizationContent(selectedLanguage.value.code)
      Object.assign(content, data)
    }
  }

  const saveLocalizationContent = async () => {
    if (selectedLanguage.value) {
      await updateLocalizationContent(selectedLanguage.value.code, { ...content })
    }
  }

  const addLanguageContent = async (languageCode: string) => {
    await addNewLanguageContent(languageCode)
  }

  const removeLanguageContent = async () => {
    if (selectedLanguage.value?.code) {
      await deleteLanguageContent(selectedLanguage.value.code)
      console.log(`Content for ${selectedLanguage.value.name} deleted.`)
      selectedLanguage.value = null
      Object.assign(content, {})
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
