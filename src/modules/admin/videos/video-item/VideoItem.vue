<template>
  <div class="video-item__wrapper d-flex-col p-4">
    <div class="video-item__url d-flex justify-sb pb-4 mb-4">
      <div class="d-flex-col w-100 mr-4">
        <label class="mb-1">Video URL</label>
        <input v-model="videoDataCopy.url" class="input" />
      </div>
      <div class="video-item__actions d-flex p-relative">
        <button @click="updateVideo" class="button button--primary button--icon mr-2">
          <span>Save</span>
          <span class="material-symbols-outlined"> check </span>
        </button>
        <button @click="removeVideo" class="button button--danger button--icon">
          <span>Remove</span>
          <span class="material-symbols-outlined"> delete </span>
        </button>
      </div>
    </div>
    <label class="mb-1">Heading</label>
    <input v-model="videoDataCopy.heading" class="input mb-4" />
    <label class="mb-1">Description</label>
    <textarea v-model="videoDataCopy.description" rows="4" class="mb-1 input textarea"></textarea>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import type { PropType } from 'vue'
import type { Video } from '../../../..//types/content'

export default defineComponent({
  props: {
    videoData: {
      type: Object as PropType<Video>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const videoDataCopy = ref({ ...props.videoData })

    watch(
      () => props.videoData,
      (newVal) => {
        videoDataCopy.value = { ...newVal }
      },
      { deep: true, immediate: true },
    )

    const updateVideo = () => {
      emit('update-video', videoDataCopy.value)
    }

    const removeVideo = () => {
      emit('remove-video')
    }

    return {
      videoDataCopy,
      updateVideo,
      removeVideo,
    }
  },
})
</script>

<style lang="scss" scoped src="./VideoItem.scss"></style>
