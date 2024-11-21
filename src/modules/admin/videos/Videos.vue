<template>
  <div class="videos__wrapper px-4">
    <div class="videos__add-button d-flex justify-end align-center p-relative">
      <button @click="addNewVideo" class="button button--primary button--icon p-absolute add">
        <span>Add</span>
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
      <div v-for="(video, index) in videos" :key="index" class="videos__item">
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
import { defineComponent, ref } from 'vue'
import VideoItem from './video-item/VideoItem.vue'
import type { Video } from '../../../types/content'

export default defineComponent({
  components: { VideoItem },
  setup() {
    const videos = ref<Video[]>([])

    const addNewVideo = () => {
      videos.value.push({ heading: '', description: '', url: '' })
    }

    const updateVideo = (index: number, updatedData: Video) => {
      videos.value[index] = updatedData
    }

    const removeVideo = (index: number) => {
      videos.value.splice(index, 1)
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
