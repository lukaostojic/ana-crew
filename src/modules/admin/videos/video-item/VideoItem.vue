<template>
  <div class="video-item__wrapper p-relative d-flex-col p-4">
    <h2 v-if="videoContentCopy.heading?.length" class="mb-3">{{ videoContentCopy.heading }}</h2>
    <h2 v-else class="mb-3">Title</h2>
    <div class="video-item__url d-flex justify-sb pb-4 mb-3">
      <!-- Video URL Input -->
      <div class="d-flex-col p-relative w-100 mr-4">
        <label class="mb-1">Video URL</label>
        <input
          v-model="videoData.url"
          class="input"
          :class="{ 'input--error': !isUrlValid && videoData.url.length > 0 }"
          @input="validateUrl"
        />
        <small v-if="!isUrlValid && videoData.url.length > 0" class="error-text p-absolute pr-2">
          Please enter a valid URL
        </small>
      </div>
      <!-- Actions -->
      <div class="video-item__actions d-flex p-relative">
        <button
          @click="updateVideoData"
          :disabled="isSaveButtonDisabled"
          :class="{ disabled: isSaveButtonDisabled }"
          class="button button--secondary button--icon mr-2"
        >
          <span>{{ videoLabels.green }}</span>
          <span class="material-symbols-outlined">
            {{ isNewVideo ? 'check' : 'upload_file' }}
          </span>
        </button>
        <button @click="removeVideo" class="button button--danger button--icon">
          <span>{{ videoLabels.red }}</span>
          <span class="material-symbols-outlined">
            {{ isNewVideo || isUrlChanged ? 'close' : 'delete' }}
          </span>
        </button>
      </div>
    </div>
    <!-- Video Preview -->
    <div class="video-item__preview mb-3 pb-4" :class="{ 'new-video': isNewVideo }">
      <div
        v-if="!isYouTubeUrl(videoData.url)"
        class="no-preview d-flex justify-center align-center"
      >
        <span class="material-symbols-outlined no-video"> video_camera_front_off </span>
      </div>
      <iframe
        v-if="isUrlValid && isYouTubeUrl(videoData.url)"
        :src="embedUrl"
        class="video-iframe"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
    <template v-if="!$props.isNewVideo">
      <!-- Heading Input -->
      <label class="mb-1">Heading</label>
      <input v-model="videoContentCopy.heading" @input="updateVideoContent" class="input mb-4" />
      <!-- Description Textarea -->
      <label class="mb-1">Description</label>
      <textarea
        v-model="videoContentCopy.description"
        @input="updateVideoContent"
        rows="4"
        class="mb-1 input textarea"
      ></textarea>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'
import type { PropType } from 'vue'
import { isValidURL } from '../../../../helpers/helper-functions'
import { useModalStore } from '../../../../stores/modal'
import type { VideoData, VideoContent } from '../../../../types/content'

export default defineComponent({
  name: 'VideoItem',
  props: {
    isNewVideo: Boolean,
    videoData: {
      type: Object as PropType<VideoData>,
      required: true,
    },
    videoContent: {
      type: Object as PropType<VideoContent>,
    },
  },
  emits: ['update-video-data', 'update-video-content', 'remove-video'],
  setup(props, { emit }) {
    const modalStore = useModalStore()
    const videoDataCopy = ref<VideoData>({ ...props.videoData })
    const videoContentCopy = ref<VideoContent>({ ...props.videoContent })
    const isUrlValid = ref(true)
    const isSaveButtonDisabled = ref(true)

    const videoLabels = computed(() => {
      return props.isNewVideo
        ? { green: 'Save', red: 'Cancel' }
        : { green: 'Update', red: 'Delete' }
    })

    const isUrlChanged = computed(() => {
      return videoDataCopy.value.url !== props.videoData.url
    })

    const embedUrl = computed(() => {
      const url = props.videoData.url
      const youtubeMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/)

      if (youtubeMatch) {
        return `https://www.youtube.com/embed/${youtubeMatch[1]}`
      }
      return ''
    })

    const isYouTubeUrl = (url: string) => {
      return /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=/.test(url)
    }

    const checkSaveButtonState = () => {
      isSaveButtonDisabled.value =
        videoDataCopy.value.url === props.videoData.url ||
        !isUrlValid.value ||
        !isYouTubeUrl(props.videoData.url)
    }

    const validateUrl = () => {
      isUrlValid.value = isValidURL(props.videoData.url)
      checkSaveButtonState()
    }

    const updateVideoData = () => {
      videoDataCopy.value.url = props.videoData.url
      isSaveButtonDisabled.value = true
      emit('update-video-data', videoDataCopy.value)
    }

    const updateVideoContent = () => {
      emit('update-video-content', videoContentCopy.value)
    }

    const removeVideo = async () => {
      if (props.isNewVideo && props.videoData.url === '') {
        emit('remove-video', videoDataCopy.value.id)
        return
      }

      if (isUrlChanged.value) {
        videoDataCopy.value.url = props.videoData.url
        return
      }

      const message = props.isNewVideo
        ? `Are you sure you want to cancel this action?`
        : `Are you sure you want to delete this video and its content for all the languages? <br><br>This action cannot be undone.`
      const isConfirmed = await modalStore.showConfirmationModal(message)

      if (isConfirmed) {
        emit('remove-video', videoDataCopy.value.id)
      }
    }

    watch(
      () => props.videoContent,
      (newVal) => {
        videoContentCopy.value = { ...newVal }
      },
      { deep: true, immediate: true },
    )

    return {
      videoDataCopy,
      videoContentCopy,
      isUrlValid,
      isSaveButtonDisabled,
      videoLabels,
      embedUrl,
      isUrlChanged,
      validateUrl,
      updateVideoData,
      updateVideoContent,
      removeVideo,
      isYouTubeUrl,
    }
  },
})
</script>

<style lang="scss" scoped src="./VideoItem.scss"></style>
