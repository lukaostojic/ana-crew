<template>
  <div class="video-item__wrapper d-flex-col p-4">
    <h2 v-if="videoDataCopy.heading?.length" class="mb-5">{{ videoDataCopy.heading }}</h2>
    <h2 v-else class="mb-5">Title</h2>
    <div class="video-item__url d-flex justify-sb pb-4 mb-4">
      <!-- Video URL Input -->
      <div class="d-flex-col p-relative w-100 mr-4">
        <label class="mb-1">Video URL</label>
        <input
          v-model="videoUrl"
          class="input"
          :class="{ 'input--error': !isUrlValid && videoUrl.length > 0 }"
          @input="validateUrl"
        />
        <small v-if="!isUrlValid && videoUrl.length > 0" class="error-text p-absolute pr-2">
          Please enter a valid URL
        </small>
        <small v-if="isDuplicateUrlError && videoUrl.length > 0" class="error-text p-absolute pr-2">
          This URL is already in use
        </small>
        <div class="preview p-absolute">
          <span class="material-symbols-outlined"> visibility </span>
        </div>
      </div>
      <!-- Actions -->
      <div class="video-item__actions d-flex p-relative">
        <button
          @click="updateVideo"
          :disabled="isSaveButtonDisabled"
          :class="{ disabled: isSaveButtonDisabled }"
          class="button button--primary button--icon mr-2"
        >
          <span>Save</span>
          <span class="material-symbols-outlined"> check </span>
        </button>
        <button @click="removeVideo" class="button button--danger button--icon">
          <span>Remove</span>
          <span class="material-symbols-outlined"> delete </span>
        </button>
      </div>
    </div>

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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'
import type { PropType } from 'vue'
import { useModalStore } from '../../../../stores/modal'
import { useVideosStore } from '../../../../stores/videos'
import { isValidURL } from '../../../../helpers/helper-functions'
import type { Video } from '../../../../types/content'

export default defineComponent({
  props: {
    allVideos: {
      type: Object as PropType<Video[]>,
      required: true,
    },
    videoData: {
      type: Object as PropType<{ videoId: string; heading: string; description: string }>,
      required: true,
    },
    videoContent: {
      type: Object,
      required: false,
    },
  },
  emits: ['update-video', 'remove-video'],
  setup(props, { emit }) {
    const modalStore = useModalStore()
    const videoStore = useVideosStore()
    const videoDataCopy = ref({ ...props.videoData })
    const videoContentCopy = ref({ ...props.videoContent })
    const isSaveButtonDisabled = ref(true)
    const isUrlValid = ref(true)
    const isDuplicateUrlError = ref(false)
    const videoUrl = ref('')

    // const videoUrl = computed(
    //   () => `https://www.youtube.com/${props.allVideos[props.videoData.videoId]?.url}` || '',
    // )

    const validateUrl = () => {
      isUrlValid.value = isValidURL(videoUrl.value)
      // isDuplicateUrlError.value = Object.values(props.allVideos).some(
      //   (video) =>
      //     `https://www.youtube.com/${video.videoId}` === videoUrl.value &&
      //     video.videoId !== props.videoData.videoId,
      // )

      isSaveButtonDisabled.value =
        !isUrlValid.value || isDuplicateUrlError.value || videoUrl.value.trim() === ''
    }

    const updateVideo = () => {
      if (isUrlValid.value) {
        videoDataCopy.value.videoId
          ? videoStore.updateVideo(videoUrl.value)
          : videoStore.addVideo(videoUrl.value)
      }
    }

    const updateVideoContent = () => {
      emit('update-video', videoContentCopy.value)
    }

    const removeVideo = async () => {
      const videoHeading = videoDataCopy.value.heading
        ? `<strong>${videoDataCopy.value.heading}</strong>`
        : 'this video'

      const message = `Are you sure you want to delete <br>${videoHeading}?`
      const isConfirmed = await modalStore.showConfirmationModal(message)

      if (isConfirmed) {
        emit('remove-video')
      }
    }

    watch(
      () => props.videoData,
      (newVal) => {
        videoDataCopy.value = { ...newVal }
        validateUrl()
      },
      { deep: true, immediate: true },
    )

    watch(
      () => videoDataCopy.value,
      () => {
        validateUrl()
      },
      { deep: true },
    )

    return {
      videoDataCopy,
      videoContentCopy,
      isSaveButtonDisabled,
      isUrlValid,
      isDuplicateUrlError,
      videoUrl,
      validateUrl,
      updateVideo,
      updateVideoContent,
      removeVideo,
    }
  },
})
</script>

<style lang="scss" scoped src="./VideoItem.scss"></style>
