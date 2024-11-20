import { db } from '../config/firebase'
import { getDoc, setDoc, updateDoc, doc } from 'firebase/firestore'

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
  content: Record<string, string>,
): Promise<void> => {
  const langDocRef = doc(db, 'content', languageCode)

  await updateDoc(langDocRef, content)
}

export const addNewLanguageContent = async (languageCode: string): Promise<void> => {
  const langDocRef = doc(db, 'content', languageCode)

  await setDoc(langDocRef, {
    HEADER_HEADING: '',
    HEADER_ABOUT_US: '',
    NAVIGATION_HOME: '',
    NAVIGATION_VIDEOS: '',
    NAVIGATION_IMAGES: '',
    NAVIGATION_ARTISTS: '',
  })
}
