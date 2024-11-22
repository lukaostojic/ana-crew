import { db } from '../config/firebase'
import { getDoc, setDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { generateEmptyContent } from '../config/content-placeholders'

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
): Promise<void> => {
  const langDocRef = doc(db, 'content', languageCode)

  await updateDoc(langDocRef, content)
  console.log(`Content for language '${languageCode}' has been updated.`)
}

export const addNewLanguageContent = async (languageCode: string): Promise<void> => {
  const langDocRef = doc(db, 'content', languageCode)

  await setDoc(langDocRef, generateEmptyContent())
  console.log(`Content for language '${languageCode}' has been added.`)
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
