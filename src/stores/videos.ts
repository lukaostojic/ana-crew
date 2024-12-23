import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchAllVideos, addNewVideo, updateExistingVideo } from '@/services/video.service'
import type { VideoData } from '@/types/content'

export const useVideosStore = defineStore('videos', () => {
  const allVideos = ref<any[]>([])
  const video = ref([])

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
    } catch (error) {
      console.error('Failed to add video:', error)
      throw error
    }
  }

  const updateVideo = async (videoData: { videoId: string; url: string }) => {
    try {
      await updateExistingVideo(videoData.videoId, videoData.url)
      const videoIndex = allVideos.value.findIndex(
        (video: VideoData) => video.id === videoData.videoId,
      )
      if (videoIndex > -1) {
        allVideos.value[videoIndex].url = videoData.url
      }
    } catch (error) {
      console.error('Failed to update video:', error)
      throw error
    }
  }

  const deleteVideo = async (id: string) => {
    allVideos.value.filter((video: any) => {
      video.id !== id
    })
  }

  return {
    getAllVideos,
    addVideo,
    updateVideo,
    deleteVideo,
    allVideos,
    video,
  }
})
