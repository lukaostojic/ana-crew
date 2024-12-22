<template>
  <div class="videos__wrapper px-4">
    <div class="videos__add-button d-flex justify-end align-center p-relative">
      <button
        @click="handleAddNewVideo"
        :class="{ disabled: isNewVideo }"
        class="button button--secondary button--icon p-absolute add"
      >
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
    <div v-else class="videos__list pb-5 pr-5">
      <div v-for="(videoData, index) in reversedVideosData" :key="videoData.id">
        <VideoItem
          class="list-item"
          :videoData="videoData"
          :videoContent="videosContent[videosData.length - 1 - index]"
          :isNewVideo="isNewVideo"
          :class="{ disabled: isNewVideo && index !== 0 }"
          @update-video-data="updateVideoData(videosData.length - 1 - index, $event)"
          @update-video-content="updateVideoContent(videosData.length - 1 - index, $event)"
          @remove-video="deleteVideo($event)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, onMounted } from 'vue'
import { useVideosStore } from '../../../stores/videos'
import { useLocalizationStore } from '../../../stores/localization'
import { updateExistingVideo, addNewVideo, removeVideo } from '../../../services/video.service'
import { generateUniqueId } from '../../../helpers/helper-functions'
import VideoItem from './video-item/VideoItem.vue'
import type { VideoContent, VideoData } from '../../../types/content'

export default defineComponent({
  name: 'Videos',
  components: { VideoItem },
  props: {
    content: Object,
  },
  emits: ['update-content'],
  setup(props, { emit }) {
    const videoStore = useVideosStore()
    const localizationStore = useLocalizationStore()
    const videosData = ref<VideoData[]>([])
    const videosContent = ref<VideoContent>({ ...props.content?.videos })
    const isNewVideo = ref(false)

    const reversedVideosData = computed(() => [...videosData.value].reverse())

    const handleAddNewVideo = () => {
      const videoId = generateUniqueId()
      const newVideo: VideoData = {
        id: videoId,
        url: '',
      }

      videosData.value.push(newVideo)
      isNewVideo.value = true
    }

    const updateVideoData = async (index: number, updatedData: VideoData) => {
      if (isNewVideo.value) {
        try {
          await addNewVideo(updatedData.id, updatedData.url)

          isNewVideo.value = false
        } catch (error) {
          console.error('Failed to add new video:', error)
        }
      } else {
        try {
          await updateExistingVideo(updatedData.id, updatedData.url)

          videosData.value[index] = updatedData
        } catch (error) {
          console.error(`Failed to update video at index ${index}:`, error)
        }
      }
    }

    const updateVideoContent = (index: number, updatedContent: VideoContent) => {
      const videoId = videosData.value[index]?.id
      updatedContent.videoId = videoId
      videosContent.value[index] = updatedContent
      emit('update-content', { videos: videosContent.value })
    }

    const deleteVideo = async (id: string) => {
      if (!isNewVideo.value) await removeVideo(id)

      videosData.value = videosData.value.filter((v: VideoData) => v.id !== id)
      isNewVideo.value = false
    }

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
      isNewVideo,
      reversedVideosData,
      handleAddNewVideo,
      updateVideoData,
      updateVideoContent,
      deleteVideo,
    }
  },
})
</script>

<style lang="scss" scoped src="./Videos.scss"></style>
