<template>
  <ul
    style="display: flex; justify-content: space-around; padding: 12px 20px; border: 2px solid blue"
  >
    <li>{{ content?.NAVIGATION_HOME }}</li>
    <li>{{ content?.NAVIGATION_VIDEOS }}</li>
    <li>{{ content?.NAVIGATION_IMAGES }}</li>
    <li>{{ content?.NAVIGATION_ARTISTS }}</li>
    <li>{{ content?.NAVIGATION_CONTACT }}</li>
  </ul>
  <div style="text-align: center; margin-top: 20px; font-size: 24px; font-weight: 600">
    {{ content?.HEADER_HEADING }}
  </div>
  <div style="text-align: center">{{ content?.HEADER_SUBHEADING }}</div>
  <div style="margin-top: 20px; font-size: 18px; font-weight: 600; text-align: center">
    {{ content?.ABOUT_US_HEADING }}
  </div>
  <div style="margin-top: 12px; text-align: center" v-html="aboutUsContentWithBreaks"></div>
  <div>
    <select v-model="selectedLanguageCode">
      <option v-for="language in availableLanguages" :key="language.code" :value="language.code">
        {{ language.name }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from 'vue'
import { fetchSelectedLanguages, fetchDefaultLanguage } from '../../services/language.service'
import { useLocalizationStore } from '../../stores/localization'
import type { Language } from '../../services/language.service'

export default defineComponent({
  setup() {
    const localizationStore = useLocalizationStore()
    const content = localizationStore.content
    const availableLanguages = ref<Language[]>([])
    const selectedLanguageCode = ref<string>('')

    const aboutUsContentWithBreaks = computed(() => {
      return content?.ABOUT_US_CONTENT?.replace(/\n/g, '<br>') || ''
    })

    const fetchLanguages = async () => {
      try {
        const defaultLanguage = await fetchDefaultLanguage()
        const languages = await fetchSelectedLanguages()

        if (defaultLanguage) {
          availableLanguages.value = [defaultLanguage, ...languages]
          selectedLanguageCode.value = defaultLanguage.code
        }

        localizationStore.setAvailableLanguages(availableLanguages.value)
      } catch (error) {
        console.error('Error fetching languages:', error)
      }
    }

    watch(selectedLanguageCode, async (newLanguageCode) => {
      if (newLanguageCode) {
        const newLanguage = availableLanguages.value.find((lang) => lang.code === newLanguageCode)

        if (newLanguage) {
          localizationStore.setLanguage(newLanguage)
          await localizationStore.loadLocalizationContent()
        }
      }
    })

    onMounted(async () => {
      await fetchLanguages()

      if (selectedLanguageCode.value) {
        const initialLanguage = availableLanguages.value.find(
          (lang) => lang.code === selectedLanguageCode.value,
        )
        if (initialLanguage) {
          localizationStore.setLanguage(initialLanguage)
        }
        await localizationStore.loadLocalizationContent()
      }
    })

    return {
      content,
      aboutUsContentWithBreaks,
      availableLanguages,
      selectedLanguageCode,
    }
  },
})
</script>

<style lang="scss" scoped></style>
