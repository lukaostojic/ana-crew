import { db } from '../config/firebase'
import { getDocs, collection, setDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'

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
    console.log('Video added successfully:', url)
  } catch (error) {
    console.error('Error adding video:', error)
    throw error
  }
}
