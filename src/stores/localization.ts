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
  const availableLanguages = ref<Language[]>([])
  const content = ref<Record<string, any>>({
    videos: [],
  })
  const videoContent = ref([])

  const setLanguage = (language: Language) => {
    selectedLanguage.value = language
  }

  const setAvailableLanguages = (languages: Language[]) => {
    availableLanguages.value = languages
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

  const saveVideoContent = async (currentLanguage: string) => {
    for (const language of availableLanguages.value) {
      const languageContent = await fetchLocalizationContent(language.code)

      if (language.code === currentLanguage) {
        languageContent.videos = content.value.videos
      } else {
        const videos = Array.isArray(languageContent.videos) ? languageContent.videos : []

        languageContent.videos = content.value.videos.map((video) => {
          const existingVideo = videos.find((v) => v.url === video.url)
          return existingVideo
            ? { ...existingVideo, url: video.url }
            : { url: video.url, heading: '', description: '' }
        })
      }

      await updateLocalizationContent(language.code, languageContent)
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
    videoContent,
    setLanguage,
    setAvailableLanguages,
    loadLocalizationContent,
    saveLocalizationContent,
    saveVideoContent,
    addLanguageContent,
    removeLanguageContent,
  }
})
