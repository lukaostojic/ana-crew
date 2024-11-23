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
          :videoData="video"
          @update-video="updateVideo(index, $event)"
          @remove-video="removeVideo(index)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useLocalizationStore } from '../../../stores/localization'
import VideoItem from './video-item/VideoItem.vue'

export default defineComponent({
  components: { VideoItem },
  props: {
    content: Object,
  },
  emits: ['update-content'],
  setup(props, { emit }) {
    const videos = computed(() => props.content?.videos || [])

    const addNewVideo = () => {
      const newVideos = [{ heading: '', description: '', url: '' }, ...videos.value]
      emit('update-content', { videos: newVideos })
    }

    const updateVideo = (index: number, updatedData: any) => {
      const newVideos = [...videos.value]
      newVideos[index] = updatedData
      emit('update-content', { videos: newVideos })
    }

    const removeVideo = async (index: number) => {
      const videoToDelete = videos.value[index]
      if (!videoToDelete?.url) return

      const localizationStore = useLocalizationStore()

      try {
        await localizationStore.deleteVideo(videoToDelete.url)
        const newVideos = videos.value.filter((_, i) => i !== index)
        emit('update-content', { videos: newVideos })
      } catch (error) {
        console.error('Failed to delete video:', error)
      }
    }

    return {
      videos,
      addNewVideo,
      updateVideo,
      removeVideo,
    }
  },
})
</script>

<style lang="scss" scoped src="./Videos.scss"></style>
