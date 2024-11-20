import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import {
  fetchLocalizationContent,
  updateLocalizationContent,
  addNewLanguageContent,
} from '../services/localization.service'
import type { Language } from '@/services/language.service'

export const useLocalizationStore = defineStore('localization', () => {
  const selectedLanguage = ref<Language>({ code: 'en', name: 'English' })
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

  return {
    selectedLanguage,
    content,
    setLanguage,
    loadLocalizationContent,
    saveLocalizationContent,
    addLanguageContent,
  }
})
