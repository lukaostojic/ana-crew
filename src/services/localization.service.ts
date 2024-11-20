import { db } from '../config/firebase'
import { getDoc, setDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'

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

export const deleteLanguageContent = async (languageCode: string): Promise<void> => {
  const langDocRef = doc(db, 'content', languageCode)

  try {
    await deleteDoc(langDocRef)
    console.log(`Content for language '${languageCode}' has been deleted.`)
  } catch (error) {
    console.error(`Failed to delete content for language '${languageCode}':`, error)
    throw new Error(`Failed to delete content for language '${languageCode}'.`)
  }
}
