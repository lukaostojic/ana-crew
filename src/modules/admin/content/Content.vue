<template>
  <div class="content__wrapper p-4">
    <div class="inner">
      <!-- Header Section -->
      <div class="content__section p-4">
        <h2 class="mb-6">Header</h2>
        <div class="content__item d-flex-col justify-sb mb-6">
          <div class="label mb-1">Heading</div>
          <textarea
            class="textarea"
            cols=""
            rows="1"
            v-model="contentData.header.heading"
          ></textarea>
        </div>
        <div class="content__item d-flex-col justify-sb mb-3">
          <div class="label mb-1">About Us</div>
          <textarea
            class="textarea"
            cols=""
            rows="8"
            v-model="contentData.header.aboutUs"
          ></textarea>
        </div>
      </div>
      <!-- Navigation Section -->
      <div class="content__section p-4">
        <h2 class="mb-6">Navigation</h2>
        <div class="d-flex navigation">
          <div
            class="content__item navigation-item d-flex-col justify-sb mb-3"
            v-for="(item, index) in contentData.navigation"
            :key="index"
          >
            <div class="label mb-1">{{ item.label }}</div>
            <textarea class="textarea" cols="" rows="1" v-model="item.value"></textarea>
          </div>
        </div>
      </div>
      <button @click="saveContent()">Save</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useLocalizationStore } from '../../../stores/localization'

export default defineComponent({
  setup() {
    const localizationStore = useLocalizationStore()

    const contentData = ref({
      header: {
        heading: '',
        aboutUs: '',
      },
      navigation: [
        { label: 'Home', value: '' },
        { label: 'Videos', value: '' },
      ],
    })

    const fetchContent = async () => {
      await localizationStore.loadLocalizationContent()
    }

    const saveContent = async () => {
      await localizationStore.saveLocalizationContent()
    }

    watch(
      () => localizationStore.content,
      (newContent) => {
        contentData.value.header.heading = newContent.HEADER_HEADING || ''
        contentData.value.header.aboutUs = newContent.HEADER_ABOUT_US || ''
        contentData.value.navigation[0].value = newContent.NAVIGATION_HOME || ''
        contentData.value.navigation[1].value = newContent.NAVIGATION_VIDEOS || ''
      },
      { deep: true, immediate: true },
    )

    watch(
      () => localizationStore.selectedLanguage,
      () => {
        fetchContent()
      },
      { deep: true, immediate: true },
    )

    return {
      contentData,
      saveContent,
    }
  },
})
</script>

<style lang="scss" scoped src="./Content.scss"></style>
