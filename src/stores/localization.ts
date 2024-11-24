import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  fetchLocalizationContent,
  updateLocalizationContent,
  addNewLanguageContent,
  deleteLanguageContent,
  deleteVideoFromAllLanguages,
} from '../services/localization.service'
import type { Language } from '@/services/language.service'
import type { Video } from '@/types/content'

export const useLocalizationStore = defineStore('localization', () => {
  const selectedLanguage = ref<Language | null>({ code: 'en', name: 'English' })
  const availableLanguages = ref<Language[]>([])
  const content = ref<Record<string, any>>({
    videos: [],
  })
  const videoContent = ref<Video[]>([])

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
      const isVideoContent = false
      await updateLocalizationContent(
        selectedLanguage.value.code,
        { ...content.value },
        isVideoContent,
      )
    }
  }

  const saveVideoContent = async (currentLanguage: string) => {
    for (const language of availableLanguages.value) {
      const languageContent = await fetchLocalizationContent(language.code)
      const isVideoContent = true

      if (language.code === currentLanguage) {
        languageContent.videos = content.value.videos
      } else {
        const videos = Array.isArray(languageContent.videos) ? languageContent.videos : []

        languageContent.videos = content.value.videos.map((video: Video) => {
          const existingVideo = videos.find((v) => v.url === video.url)
          return existingVideo
            ? { ...existingVideo, url: video.url }
            : { url: video.url, heading: '', description: '' }
        })
      }

      await updateLocalizationContent(language.code, languageContent, isVideoContent)
    }
  }

  const deleteVideo = async (videoUrl: string) => {
    const languageCodes = availableLanguages.value.map((lang) => lang.code)
    await deleteVideoFromAllLanguages(languageCodes, videoUrl)
    content.value.videos = content.value.videos.filter((video: any) => video.url !== videoUrl)
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
    deleteVideo,
    addLanguageContent,
    removeLanguageContent,
  }
})
