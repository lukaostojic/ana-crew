import { db } from '../config/firebase'
import { getDoc, setDoc, updateDoc, doc } from 'firebase/firestore'

export interface Language {
  code: string
  name: string
}

export const fetchSelectedLanguages = async (): Promise<Language[]> => {
  const langRef = doc(db, 'languages', 'selectedLanguages')
  const langSnap = await getDoc(langRef)

  if (langSnap.exists()) {
    return langSnap.data()?.selectedLanguages || []
  }
  console.log('No selected languages found!')
  return []
}

export const fetchDefaultLanguage = async (): Promise<Language | null> => {
  const settingsRef = doc(db, 'settings', 'defaultLanguage')
  const settingsSnap = await getDoc(settingsRef)

  if (settingsSnap.exists()) {
    return settingsSnap.data() as Language
  }
  console.log('No default language found!')
  return null
}

export const updateSelectedLanguages = async (languages: Language[]) => {
  const langRef = doc(db, 'languages', 'selectedLanguages')
  await setDoc(langRef, { selectedLanguages: languages })
}

export const deleteSelectedLanguage = async (language: { code: string; name: string }) => {
  const langRef = doc(db, 'languages', 'selectedLanguages')
  const langSnap = await getDoc(langRef)

  if (langSnap.exists()) {
    const data = langSnap.data()
    const updatedLanguages = (data?.selectedLanguages || []).filter(
      (selected: { code: string }) => selected.code !== language.code,
    )

    await updateDoc(langRef, { selectedLanguages: updatedLanguages })
  } else {
    throw new Error('Languages document does not exist!')
  }
}
