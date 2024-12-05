import { db } from '../config/firebase'
import { getDoc, getDocs, collection, setDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { useNotificationStore } from '@/stores/notification'

export const fetchAllVideos = async () => {
  try {
    const videosCollectionRef = collection(db, 'videos')
    const querySnapshot = await getDocs(videosCollectionRef)
    const videos = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    return videos
  } catch (error) {
    throw error
  }
}

export const addNewVideo = async (id: string, url: string) => {
  try {
    const videoRef = doc(db, 'videos', id)
    await setDoc(videoRef, { url })

    const notificationStore = useNotificationStore()
    notificationStore.setNotification('New video added successfully')
  } catch (error) {
    console.error('Error adding video:', error)
    throw error
  }
}

export const updateExistingVideo = async (id: string, url: string) => {
  try {
    const videoRef = doc(db, 'videos', id)
    await updateDoc(videoRef, { url })

    const notificationStore = useNotificationStore()
    notificationStore.setNotification('Video has been updated')
  } catch (error) {
    console.error('Error updating video:', error)
    throw error
  }
}

export const removeVideo = async (id: string) => {
  try {
    const videoRef = doc(db, 'videos', id)
    await deleteDoc(videoRef)

    const languagesSnapshot = await getDocs(collection(db, 'content'))
    const languages = languagesSnapshot.docs.map((doc) => doc.id)

    for (const language of languages) {
      const languageDocRef = doc(db, 'content', language)
      const languageDocSnapshot = await getDoc(languageDocRef)

      if (!languageDocSnapshot.exists()) continue
      const data = languageDocSnapshot.data()
      const videos = data.videos || []
      const updatedVideos = videos.filter((video) => video.videoId !== id)

      if (videos.length === updatedVideos.length) continue
      await updateDoc(languageDocRef, { videos: updatedVideos })
    }

    const notificationStore = useNotificationStore()
    notificationStore.setNotification('Video has been deleted')
  } catch (error) {
    console.error('Error deleting video and content:', error)
    throw error
  }
}
