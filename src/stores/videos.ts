import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchAllVideos, addNewVideo, updateExistingVideo } from '@/services/video.service'

export const useVideosStore = defineStore('videos', () => {
  const allVideos = ref<any>([])
  const video = ref()

  const getAllVideos = async () => {
    try {
      const videos = await fetchAllVideos()
      allVideos.value = videos
    } catch (error) {
      console.error('Failed to load videos:', error)
    }
  }

  const addVideo = async (id: string, url: string) => {
    try {
      await addNewVideo(id, url)
      allVideos.value.push({ id, url })
      console.log(`Video added to store: ${id}`)
    } catch (error) {
      console.error('Failed to add video:', error)
      throw error
    }
  }

  const updateVideo = async (videoData: { videoId: string; url: string }) => {
    try {
      await updateExistingVideo(videoData.videoId, videoData.url)
      const videoIndex = allVideos.value.findIndex((video) => video.id === videoData.videoId)
      if (videoIndex > -1) {
        allVideos.value[videoIndex].url = videoData.url // Update store
        console.log(`Video with ID ${videoData.videoId} updated in store.`)
      }
    } catch (error) {
      console.error('Failed to update video:', error)
      throw error
    }
  }

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
