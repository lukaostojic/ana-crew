<template>
  <div class="content__wrapper px-4">
    <div class="inner" v-if="contentData">
      <!-- Header Section -->
      <div class="content__section p-4 mb-5">
        <h2 class="mb-5">Header</h2>
        <div class="content__item d-flex-col justify-sb mb-4">
          <div class="label mb-1">Heading</div>
          <textarea
            class="textarea"
            rows="1"
            v-model="contentData.header.heading"
            @input="updateContent('HEADER_HEADING', contentData.header.heading)"
          ></textarea>
        </div>
        <div class="content__item d-flex-col justify-sb mb-3">
          <div class="label mb-1">About Us</div>
          <textarea
            class="textarea"
            rows="8"
            v-model="contentData.header.aboutUs"
            @input="updateContent('HEADER_ABOUT_US', contentData.header.aboutUs)"
          ></textarea>
        </div>
      </div>
      <!-- Navigation Section -->
      <div class="content__section p-4 mb-5">
        <h2 class="mb-5">Navigation</h2>
        <div class="d-flex navigation">
          <div
            class="content__item navigation-item d-flex-col justify-sb mb-3"
            v-for="(item, index) in contentData.navigation"
            :key="index"
          >
            <div class="label mb-1">{{ item.label }}</div>
            <textarea
              class="textarea"
              rows="1"
              v-model="item.value"
              @input="updateContent(`NAVIGATION_${item.label.toUpperCase()}`, item.value)"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'
import type { Content } from '../../../types/content'

export default defineComponent({
  name: 'Content',
  props: {
    content: Object,
  },
  emits: ['update-content'],
  setup(props, { emit }) {
    const contentData = ref<Content>()

    const mapContent = (newContent) => {
      contentData.value = {
        header: {
          heading: newContent?.HEADER_HEADING || '',
          aboutUs: newContent?.HEADER_ABOUT_US || '',
        },
        navigation: [
          { label: 'Home', value: newContent?.NAVIGATION_HOME || '' },
          { label: 'Videos', value: newContent?.NAVIGATION_VIDEOS || '' },
          { label: 'Images', value: newContent?.NAVIGATION_IMAGES || '' },
          { label: 'Artists', value: newContent?.NAVIGATION_ARTISTS || '' },
          { label: 'Contact', value: newContent?.NAVIGATION_CONTACT || '' },
        ],
        videos: Array.isArray(newContent?.videos)
          ? newContent.videos.map((video) => ({
              heading: video.heading || '',
              url: video.url || '',
              description: video.description || '',
            }))
          : [],
      }
    }

    const updateContent = (field: string, value: any) => {
      emit('update-content', { [field]: value, newVideoAdded: false })
    }

    watch(
      () => props.content,
      (newContent) => {
        mapContent(newContent)
      },
      { immediate: true, deep: true },
    )

    return {
      contentData,
      updateContent,
    }
  },
})
</script>

<style lang="scss" scoped src="./Content.scss"></style>
