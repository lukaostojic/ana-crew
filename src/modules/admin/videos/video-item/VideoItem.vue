<template>
  <div class="video-item__wrapper d-flex-col p-4">
    <h2 v-if="videoDataCopy.heading.length" class="mb-5">{{ videoDataCopy.heading }}</h2>
    <h2 v-else class="mb-5">Title</h2>
    <div class="video-item__url d-flex justify-sb pb-4 mb-4">
      <!-- Video URL Input -->
      <div class="d-flex-col p-relative w-100 mr-4">
        <label class="mb-1">Video URL</label>
        <input
          v-model="videoDataCopy.url"
          class="input"
          :class="{ 'input--error': !isUrlValid && videoDataCopy.url.length > 0 }"
          @input="validateUrl"
        />
        <small
          v-if="!isUrlValid && videoDataCopy.url.length > 0"
          class="error-text p-absolute pr-2"
        >
          Please enter a valid URL
        </small>
        <small
          v-if="isDuplicateUrlError && videoDataCopy.url.length > 0"
          class="error-text p-absolute pr-2"
        >
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
          <span>Update</span>
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
    <input v-model="videoDataCopy.heading" class="input mb-4" />

    <!-- Description Textarea -->
    <label class="mb-1">Description</label>
    <textarea v-model="videoDataCopy.description" rows="4" class="mb-1 input textarea"></textarea>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { useModalStore } from '../../../../stores/modal'
import { isValidURL } from '../../../../helpers/helper-functions'
import type { Video } from '../../../../types/content'

export default defineComponent({
  props: {
    allVideos: {
      type: Object as PropType<Video[]>,
      required: true,
    },
    videoData: {
      type: Object as PropType<Video>,
      required: true,
    },
  },
  emits: ['update-video', 'remove-video'],
  setup(props, { emit }) {
    const modalStore = useModalStore()
    const videoDataCopy = ref({ ...props.videoData })
    const isSaveButtonDisabled = ref(true)
    const isUrlValid = ref(true)
    const isDuplicateUrlError = ref(false)

    const validateUrl = () => {
      isUrlValid.value = isValidURL(videoDataCopy.value.url)
      isDuplicateUrlError.value = props.allVideos.some(
        (v: Video) => v.url === videoDataCopy.value.url && v !== props.videoData,
      )

      const isUnchanged =
        videoDataCopy.value.url === props.videoData?.url &&
        videoDataCopy.value.heading === props.videoData?.heading &&
        videoDataCopy.value.description === props.videoData?.description

      isSaveButtonDisabled.value =
        !isUrlValid.value ||
        isDuplicateUrlError.value ||
        videoDataCopy.value.url.trim() === '' ||
        isUnchanged
    }

    const updateVideo = () => {
      if (isUrlValid.value) {
        emit('update-video', videoDataCopy.value)
      }
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

    const isDuplicateUrl = (video: Video): boolean => {
      return props.allVideos.some((v: Video) => v.url === video.url)
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
      isSaveButtonDisabled,
      isUrlValid,
      isDuplicateUrlError,
      validateUrl,
      updateVideo,
      removeVideo,
    }
  },
})
</script>

<style lang="scss" scoped src="./VideoItem.scss"></style>
