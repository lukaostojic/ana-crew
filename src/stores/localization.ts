import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  fetchLocalizationContent,
  updateLocalizationContent,
  addNewLanguageContent,
  deleteLanguageContent,
} from '../services/localization.service'
import type { Language } from '@/services/language.service'
import type { Content, VideoContent } from '@/types/content'

export const useLocalizationStore = defineStore('localization', () => {
  const selectedLanguage = ref<Language | null>({ code: 'en', name: 'English' })
  const availableLanguages = ref<Language[]>([])
  const content = ref<Record<string, any>>({
    videos: [],
  })

  const setLanguage = (language: Language) => {
    selectedLanguage.value = language
  }

  const setAvailableLanguages = (languages: Language[]) => {
    availableLanguages.value = languages
  }

  const setLocalizationContent = (content) => {
    content.value = content
  }

  const loadLocalizationContent = async () => {
    if (selectedLanguage.value?.code) {
      const data: Record<string, any> = await fetchLocalizationContent(selectedLanguage.value.code)
      if (!data.videos) {
        data.videos = []
      }
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
    setAvailableLanguages,
    setLocalizationContent,
    loadLocalizationContent,
    saveLocalizationContent,
    addLanguageContent,
    removeLanguageContent,
  }
})
