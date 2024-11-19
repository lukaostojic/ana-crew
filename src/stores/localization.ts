import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import {
  fetchLocalizationContent,
  updateLocalizationContent,
  addNewLanguageContent,
} from '../services/localization.service'

export const useLocalizationStore = defineStore('localization', () => {
  const selectedLanguage = ref<{ code: string; name: string } | null>(null)
  const content = reactive<Record<string, string>>({})

  const setLanguage = (language: { code: string; name: string }) => {
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
