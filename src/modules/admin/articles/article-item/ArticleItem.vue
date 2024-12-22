<template>
  <div :class="{ 'hide-data': !isDataVisible }" class="article-item__wrapper p-relative p-4">
    <div class="d-flex justify-sb align-center">
      <h2 v-if="articleContentCopy.heading?.length" class="mb-3">
        {{ articleContentCopy.heading }}
      </h2>
      <h2 v-else class="mb-3">Title</h2>
      <span
        @click="isDataVisible = !isDataVisible"
        class="material-symbols-outlined dropdown-arrow hide-data-icon mb-3 p-1"
      >
        {{ isDataVisible ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
      </span>
    </div>
    <div v-if="isDataVisible" class="article-item__data d-flex-col justify-sb align-start mb-3">
      <div class="d-flex justify-sb align-center w-100 mb-3">
        <!-- External Link -->
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
        <!-- Actions -->
        <div class="actions d-flex justify-end align-center w-100 mt-5">
          <button
            @click="updateArticleData"
            :class="{
              disabled: isSaveButtonDisabled || !isUrlValid,
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
      <!-- Image Preview / Upload -->
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
        <div v-if="isActionInProgress" class="loader p-absolute">
          <img src="../../../../assets/loading.gif" alt="" />
        </div>
      </div>
    </div>
    <div
      v-if="!$props.isNewArticle"
      :style="{ marginTop: isDataVisible ? '' : '0' }"
      class="article-item__content d-flex-col mt-6"
    >
      <!-- Heading Input -->
      <label class="mb-1 mt-3">Heading</label>
      <input
        v-model="articleContentCopy.heading"
        @input="updateArticleContent"
        class="input mb-4"
      />
      <!-- Content Textarea -->
      <label class="mb-1">Content</label>
      <textarea
        v-model="articleContentCopy.content"
        @input="updateArticleContent"
        rows="14"
        class="mb-1 input textarea"
      ></textarea>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'
import type { PropType } from 'vue'
import { useModalStore } from '../../../../stores/modal'
import { isValidURL, deepEqual } from '../../../../helpers/helper-functions'
import type { ArticleData, ArticleContent } from '../../../../types/content'

export default defineComponent({
  props: {
    isNewArticle: Boolean,
    isActionInProgress: Boolean,
    articleData: {
      type: Object as PropType<ArticleData>,
      required: true,
    },
    articleContent: {
      type: Object as PropType<ArticleContent>,
    },
  },
  emits: ['update-article-data', 'update-article-content', 'remove-article'],
  setup(props, { emit }) {
    const modalStore = useModalStore()
    const fileInput = ref<HTMLInputElement | null>(null)
    const imagePreview = ref<string | null>(null)
    const imageSrouce = ref()
    const isPreUploadTriggered = ref(false)
    const articleDataCopy = ref<ArticleData>({ ...props.articleData })
    const articleContentCopy = ref<ArticleContent>({ ...props.articleContent })
    const isUrlValid = ref(true)
    const isSaveButtonDisabled = ref(true)
    const isDataVisible = ref(true)

    const articleLabels = computed(() => {
      return props.isNewArticle
        ? { green: 'Save', red: 'Cancel' }
        : { green: 'Update', red: 'Delete' }
    })

    const checkSaveButtonState = () => {
      const isImageChanged = imagePreview.value && imagePreview.value !== props.articleData.imageUrl
      const isLinkChanged = articleDataCopy.value.link !== props.articleData.link

      isSaveButtonDisabled.value = !(isImageChanged || isLinkChanged)
    }

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
          checkSaveButtonState()
        }
        reader.readAsDataURL(file)
      }
    }

    const validateUrl = () => {
      const link = props.articleData.link || ''
      isUrlValid.value = !link || isValidURL(link)
      checkSaveButtonState()
    }

    const updateArticleData = async () => {
      if (imagePreview.value || props.articleData.link !== articleDataCopy.value.link) {
        emit('update-article-data', {
          imageSource: imageSrouce.value,
          link: props.articleData.link,
        })
        isPreUploadTriggered.value = false
        isSaveButtonDisabled.value = true
      }
    }

    const updateArticleContent = () => {
      emit('update-article-content', articleContentCopy.value)
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
      () => props.articleContent,
      (newVal) => {
        articleContentCopy.value = { ...newVal }
      },
      { deep: true, immediate: true },
    )

    return {
      fileInput,
      articleLabels,
      imagePreview,
      isPreUploadTriggered,
      isUrlValid,
      articleContentCopy,
      isSaveButtonDisabled,
      isDataVisible,
      handleFileUpload,
      triggerFileUpload,
      validateUrl,
      updateArticleData,
      updateArticleContent,
      removeArticle,
    }
  },
})
</script>

<style lang="scss" scoped src="./ArticleItem.scss"></style>
