<template>
  <div class="content__wrapper px-4">
    <div class="inner" v-if="contentData">
      <!-- Header Section -->
      <div class="content__section p-4">
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
          <div class="label mb-1">Subheading</div>
          <textarea
            class="textarea"
            rows="8"
            v-model="contentData.header.subheading"
            @input="updateContent('HEADER_SUBHEADING', contentData.header.subheading)"
          ></textarea>
        </div>
      </div>
      <!-- About Us Section -->
      <div class="content__section p-4">
        <h2 class="mb-5">About Us</h2>
        <div class="content__item d-flex-col justify-sb mb-4">
          <div class="label mb-1">Heading</div>
          <textarea
            class="textarea"
            rows="1"
            v-model="contentData.aboutUs.heading"
            @input="updateContent('ABOUT_US_HEADING', contentData.aboutUs.heading)"
          ></textarea>
        </div>
        <div class="content__item d-flex-col justify-sb mb-3">
          <div class="label mb-1">Content</div>
          <textarea
            class="textarea"
            rows="8"
            v-model="contentData.aboutUs.content"
            @input="updateContent('ABOUT_US_CONTENT', contentData.aboutUs.content)"
          ></textarea>
        </div>
      </div>
      <!-- Navigation Section -->
      <div class="content__section navigation-section p-4 mb-5">
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
import { defineComponent, ref, watch } from 'vue'
import type { Content } from '../../../types/content'

export default defineComponent({
  name: 'Content',
  props: {
    content: Object,
  },
  emits: ['update-content'],
  setup(props, { emit }) {
    const contentData = ref<Content>()

    const mapContent = (newContent: any) => {
      contentData.value = {
        header: {
          heading: newContent?.HEADER_HEADING || '',
          subheading: newContent?.HEADER_SUBHEADING || '',
        },
        navigation: [
          { label: 'Home', value: newContent?.NAVIGATION_HOME || '' },
          { label: 'Videos', value: newContent?.NAVIGATION_VIDEOS || '' },
          { label: 'Images', value: newContent?.NAVIGATION_IMAGES || '' },
          { label: 'Artists', value: newContent?.NAVIGATION_ARTISTS || '' },
          { label: 'Contact', value: newContent?.NAVIGATION_CONTACT || '' },
        ],
        aboutUs: {
          heading: newContent?.ABOUT_US_HEADING || '',
          content: newContent?.ABOUT_US_CONTENT || '',
        },
        videos: newContent?.videos || [],
      }
    }

    const updateContent = (field: string, value: any) => {
      emit('update-content', { [field]: value })
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
