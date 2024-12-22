import { db } from '../config/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useNotificationStore } from '../stores/notification'
import type { ContactDetails } from '@/types/contact'

export const fetchContactDetails = async () => {
  const contactDocRef = doc(db, 'contact', 'contactDetails')
  const contactDoc = await getDoc(contactDocRef)

  if (contactDoc.exists()) {
    return contactDoc.data() as ContactDetails
  } else {
    throw new Error('Contact details not found')
  }
}

export const updateContactDetails = async (details: ContactDetails) => {
  const contactDocRef = doc(db, 'contact', 'contactDetails')
  await setDoc(contactDocRef, details, { merge: true })

  const notificationStore = useNotificationStore()
  notificationStore.setNotification('Contact Details updated successfully')
}
