import { db } from '../config/firebase'
import { getDoc, setDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { generateEmptyContent } from '../config/content-placeholders'
import { useNotificationStore } from '../stores/notification'
import { useLocalizationStore } from '@/stores/localization'

export const fetchLocalizationContent = async (
  languageCode: string,
): Promise<Record<string, string>> => {
  const langDocRef = doc(db, 'content', languageCode)
  const langDocSnap = await getDoc(langDocRef)

  if (langDocSnap.exists()) {
    return langDocSnap.data() as Record<string, string>
  }
  console.log(`No content found for language: ${languageCode}`)
  return {}
}

export const updateLocalizationContent = async (
  languageCode: string,
  content: any,
  isVideoContent: boolean,
): Promise<void> => {
  const langDocRef = doc(db, 'content', languageCode)
  await updateDoc(langDocRef, content)

  const notificationStore = useNotificationStore()
  const localizationStore = useLocalizationStore()
  isVideoContent
    ? notificationStore.setNotification('New video successfully added')
    : notificationStore.setNotification(
        `Content for <strong>${localizationStore.selectedLanguage?.name}</strong> language has been updated.`,
      )
}

export const addNewLanguageContent = async (languageCode: string): Promise<void> => {
  const langDocRef = doc(db, 'content', languageCode)
  await setDoc(langDocRef, generateEmptyContent())

  const notificationStore = useNotificationStore()
  notificationStore.setNotification(
    `Content for language <strong>'${languageCode.toUpperCase()}'</strong> has been added.`,
  )
}

export const deleteLanguageContent = async (languageCode: string): Promise<void> => {
  const langDocRef = doc(db, 'content', languageCode)

  try {
    await deleteDoc(langDocRef)

    const notificationStore = useNotificationStore()
    notificationStore.setNotification(
      `Content for language <strong>'${languageCode.toUpperCase()}'</strong> has been deleted.`,
    )
  } catch (error) {
    console.error(`Failed to delete content for language '${languageCode}':`, error)
    throw new Error(`Failed to delete content for language '${languageCode}'.`)
  }
}

export const deleteVideoFromLanguage = async (
  languageCode: string,
  videoUrl: string,
): Promise<void> => {
  const langDocRef = doc(db, 'content', languageCode)
  const langDocSnap = await getDoc(langDocRef)

  if (!langDocSnap.exists()) {
    console.warn(`No content found for language: ${languageCode}`)
    return
  }

  const contentData = langDocSnap.data()
  if (Array.isArray(contentData.videos)) {
    const updatedVideos = contentData.videos.filter((video: any) => video.url !== videoUrl)
    await updateDoc(langDocRef, { videos: updatedVideos })
  }
}

export const deleteVideoFromAllLanguages = async (
  availableLanguages: string[],
  videoUrl: string,
): Promise<void> => {
  const deletionPromises = availableLanguages.map((languageCode) =>
    deleteVideoFromLanguage(languageCode, videoUrl),
  )

  try {
    await Promise.all(deletionPromises)

    const notificationStore = useNotificationStore()
    notificationStore.setNotification(`Video has been deleted.`)
  } catch (error) {
    console.error(`Failed to delete video with URL '${videoUrl}' from all languages:`, error)
    throw new Error('Failed to delete video from all languages.')
  }
}
