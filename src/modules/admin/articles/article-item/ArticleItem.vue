<template>
  <div class="article-item__wrapper p-4">
    <div class="article-item__data d-flex-col justify-sb align-start">
      <div class="d-flex justify-sb align-center w-100">
        <div class="external-link d-flex-col p-relative w-100 mr-4">
          <label class="mb-1">External Link - Optional</label>
          <input
            v-model="articleData.link"
            class="input"
            :class="{
              'input--error': !isUrlValid && articleData.link && articleData.link.length > 0,
            }"
            @input="validateUrl"
          />
          <small
            v-if="!isUrlValid && articleData.link && articleData.link.length > 0"
            class="error-text p-absolute pr-2"
          >
            Please enter a valid URL
          </small>
        </div>
        <div class="actions d-flex justify-end align-center w-100 mt-5">
          <button
            @click="updateArticleData"
            :class="{
              disabled: !isPreUploadTriggered && !isUrlValid,
            }"
            class="button button--secondary button--icon mr-2"
          >
            <span>{{ articleLabels.green }}</span>
            <span class="material-symbols-outlined">
              {{ isNewArticle ? 'check' : 'upload_file' }}
            </span>
          </button>
          <button @click="removeArticle" class="button button--danger button--icon">
            <span>{{ articleLabels.red }}</span>
            <span class="material-symbols-outlined">
              {{ isNewArticle ? 'close' : 'delete' }}
            </span>
          </button>
        </div>
      </div>
      <div class="image-upload p-relative w-100 mt-4">
        <input type="file" @change="handleFileUpload" ref="fileInput" />
        <div
          class="image-upload__card d-flex justify-center align-center p-relative"
          @click="triggerFileUpload"
          :class="{ 'has-preview': articleData.imageUrl }"
        >
          <div v-if="!imagePreview" class="image-upload__placeholder p-relative">
            <span v-if="!articleData.imageUrl" class="material-symbols-outlined"
              >add_photo_alternate</span
            >
            <img v-else :src="articleData.imageUrl" class="image-upload__preview" />
          </div>
          <img v-else :src="imagePreview" alt="Uploaded preview" class="image-upload__preview" />
          <div class="upload-icon p-absolute">
            <span class="material-symbols-outlined"> perm_media </span>
          </div>
        </div>
      </div>
    </div>
    <div class="article-item__content"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'
import type { PropType } from 'vue'
import { useModalStore } from '../../../../stores/modal'
import { isValidURL } from '../../../../helpers/helper-functions'
import type { ArticleData, ArticleContent } from '../../../../types/content'

export default defineComponent({
  props: {
    isNewArticle: Boolean,
    articleData: {
      type: Object as PropType<ArticleData>,
      required: true,
    },
  },
  emits: ['update-article-data', 'update-article-content', 'remove-article'],
  setup(props, { emit }) {
    const fileInput = ref<HTMLInputElement | null>(null)
    const modalStore = useModalStore()
    const imagePreview = ref<string | null>(null)
    const imageSrouce = ref()
    const isPreUploadTriggered = ref(false)
    const articleDataCopy = ref<ArticleData>({ ...props.articleData })
    const isUrlValid = ref()

    const articleLabels = computed(() => {
      return props.isNewArticle
        ? { green: 'Save', red: 'Cancel' }
        : { green: 'Update', red: 'Delete' }
    })

    const triggerFileUpload = () => {
      fileInput.value?.click()
    }

    const handleFileUpload = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      imageSrouce.value = event
      isPreUploadTriggered.value = true

      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          imagePreview.value = reader.result as string
        }
        reader.readAsDataURL(file)
      }
    }

    const validateUrl = () => {
      if (props.articleData.link) {
        isUrlValid.value = isValidURL(props.articleData.link)
      }
    }

    const updateArticleData = async () => {
      if (imagePreview.value || articleDataCopy.value.link) {
        emit('update-article-data', {
          imageSource: imageSrouce.value,
          link: articleDataCopy.value.link,
        })
        isPreUploadTriggered.value = false
      }
    }

    const removeArticle = async () => {
      if (props.isNewArticle && !imagePreview.value) {
        emit('remove-article', articleDataCopy.value.id)
        return
      }

      const message = props.isNewArticle
        ? `Are you sure you want to cancel this action?`
        : `Are you sure you want to delete this article and its content for all the languages? <br><br>This action cannot be undone.`
      const isConfirmed = await modalStore.showConfirmationModal(message)

      if (isConfirmed) {
        emit('remove-article', articleDataCopy.value.id)
      }
    }

    watch(
      () => props.articleData,
      (newVal) => {
        // if (articleDataCopy.value.link === props.articleData.link && props.isNewArticle) {
        articleDataCopy.value = { ...newVal }
        // }
      },
      { deep: true, immediate: true },
    )

    return {
      fileInput,
      articleLabels,
      imagePreview,
      isPreUploadTriggered,
      isUrlValid,
      handleFileUpload,
      triggerFileUpload,
      validateUrl,
      updateArticleData,
      removeArticle,
    }
  },
})
</script>

<style lang="scss" scoped src="./ArticleItem.scss"></style>
