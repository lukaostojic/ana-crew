<template>
  <div class="videos__wrapper px-4">
    <div class="videos__add-button d-flex justify-end align-center p-relative">
      <button @click="addNewVideo" class="button button--primary button--icon p-absolute add">
        <span>Add Video</span>
        <span class="material-symbols-outlined"> add </span>
      </button>
    </div>
    <div v-if="videos.length === 0" class="videos__no-videos d-flex justify-center align-center">
      <div class="d-flex-col align-center">
        <p>No Videos added</p>
        <span class="material-symbols-outlined no-video"> video_camera_front_off </span>
      </div>
    </div>
    <div v-else class="videos__list pb-5">
      <div v-for="(video, index) in videos" :key="index">
        <VideoItem
          :allVideos="videos"
          :videoData="video"
          :videoContent="videoContent"
          @update-video="updateVideo(index, $event)"
          @remove-video="removeVideo(index)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'
import { useLocalizationStore } from '../../../stores/localization'
import { useVideosStore } from '../../../stores/videos'
import VideoItem from './video-item/VideoItem.vue'
import type { Video } from '../../../types/content'

export default defineComponent({
  components: { VideoItem },
  props: {
    content: Object,
  },
  emits: ['update-content'],
  setup(props, { emit }) {
    const localizationStore = useLocalizationStore()
    const videosStore = useVideosStore()
    const videos = ref([])
    const videoContent = ref()
    const isNewVideoAdded = ref(false)

    watch(
      () => props.content?.videos,
      (newVideos) => {
        videoContent.value = [...(newVideos || [])]
      },
    )

    const addNewVideo = () => {
      const newVideos = [{ heading: '', description: '' }, ...videos.value]
      isNewVideoAdded.value = true
      emit('update-content', { videos: newVideos })
    }

    const updateVideo = (index: number, updatedContent: any) => {
      const newVideos = [...videoContent.value]
      newVideos[index] = updatedContent
      emit('update-content', { videos: newVideos })
      console.log('from videos', newVideos)
    }

    // const updateVideo = (index: number, updatedData: any) => {
    // const newVideos = [...videos.value]
    // const videoToUpdate = newVideos[index]
    // console.log(updatedData)
    // newVideos[index] = {
    //   ...videoToUpdate,
    //   heading: updatedData.heading,
    //   description: updatedData.description,
    // }
    // const videoId = updatedData.videoId
    // if (videos.value[videoId]?.url !== updatedData.url) {
    //   videos.value[videoId] = { ...videos.value[videoId], url: updatedData.url }
    // }
    // emit('update-content', { videos: newVideos })
    // }

    const removeVideo = async (index: number) => {
      // const videoToDelete = videos.value[index]
      // if (!videoToDelete?.url) {
      //   videos.value = videos.value.filter((_, i) => i !== index)
      //   return
      // }
      // try {
      //   await videosStore.deleteVideo(videoToDelete.url)
      //   videos.value = videos.value.filter((_, i) => i !== index)
      // } catch (error) {
      //   console.error('Failed to delete video:', error)
      // }
    }

    watch(
      () => videosStore.allVideos,
      () => {
        videos.value = videosStore.allVideos
      },
      { deep: true },
    )

    onMounted(() => {
      videosStore.getAllVideos()
      // videos.value = videosStore.allVideos
    })

    return {
      videos,
      videoContent,
      addNewVideo,
      updateVideo,
      removeVideo,
    }
  },
})
</script>

<style lang="scss" scoped src="./Videos.scss"></style>
