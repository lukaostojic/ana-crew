<template>
  <div class="videos__wrapper px-4">
    <div class="videos__add-button d-flex justify-end align-center p-relative">
      <button @click="addNewVideo" class="button button--secondary button--icon p-absolute add">
        <span>Add Video</span>
        <span class="material-symbols-outlined"> add </span>
      </button>
    </div>
    <div
      v-if="videosData.length === 0"
      class="videos__no-videos d-flex justify-center align-center"
    >
      <div class="d-flex-col align-center">
        <p>No Videos added</p>
        <span class="material-symbols-outlined no-video"> video_camera_front_off </span>
      </div>
    </div>
    <div v-else class="videos__list pb-5">
      <div v-for="(videoData, index) in videosData" :key="index">
        <VideoItem
          :allVideos="videosData"
          :videoData="videoData"
          :videoContent="videosContent[index]"
          @update-video-data="updateVideoData(index, $event)"
          @update-video-content="updateVideoContent(index, $event)"
          @remove-video="removeVideo(index)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'
import { useVideosStore } from '../../../stores/videos'
import { useLocalizationStore } from '../../../stores/localization'
import { generateUniqueId } from '../../../helpers/helper-functions'
import VideoItem from './video-item/VideoItem.vue'

export default defineComponent({
  components: { VideoItem },
  props: {
    content: Object,
  },
  emits: ['update-content'],
  setup(props, { emit }) {
    const videoStore = useVideosStore()
    const localizationStore = useLocalizationStore()
    const videosData = ref<any>([])
    const videosContent = ref<any>({ ...props.content?.videos })

    const addNewVideo = () => {}

    const updateVideoData = (index: number, updatedData: { videoId: string; url: string }) => {}

    const updateVideoContent = (
      index: number,
      updatedContent: { videoId: string; heading: string; description: string },
    ) => {
      const videoId = videosData.value[index]?.id
      updatedContent.videoId = videoId
      videosContent.value[index] = updatedContent
      emit('update-content', { videos: videosContent.value })
    }

    const removeVideo = (index: number) => {}

    watch(
      () => videoStore.allVideos,
      (newVal) => {
        videosData.value = newVal
      },
      { deep: true, immediate: true },
    )

    watch(
      () => localizationStore.content.videos,
      (newVal) => {
        if (localizationStore.content.videos) {
          videosContent.value = newVal
        }
      },
      { deep: true, immediate: true },
    )

    onMounted(() => {
      videoStore.getAllVideos()
    })

    return {
      videosData,
      videosContent,
      addNewVideo,
      updateVideoData,
      updateVideoContent,
      removeVideo,
    }
  },
})
</script>

<style lang="scss" scoped src="./Videos.scss"></style>
