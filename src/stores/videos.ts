import { defineStore } from 'pinia'
import { ref } from 'vue'
import { generateUniqueId } from '@/helpers/helper-functions'
import { fetchAllVideos, addNewVideo } from '@/services/video.service'

export const useVideosStore = defineStore('videos', () => {
  const allVideos = ref<any>([])
  const video = ref()

  const getAllVideos = async () => {
    try {
      const videos = await fetchAllVideos()
      allVideos.value = videos
      console.log('Videos loaded into store:', videos)
    } catch (error) {
      console.error('Failed to load videos:', error)
    }
  }

  const addVideo = async (url: string) => {
    const id = generateUniqueId()

    if (url && id) {
      await addNewVideo(id, url)
      allVideos.value[id] = url
      console.log('Video added to store:', url)
    }
  }

  const updateVideo = async (url) => {}

  const deleteVideo = async (url: string) => {}

  return {
    getAllVideos,
    addVideo,
    updateVideo,
    deleteVideo,
    allVideos,
    video,
  }
})
