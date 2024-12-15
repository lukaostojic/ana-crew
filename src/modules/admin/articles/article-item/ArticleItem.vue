<template>
  <div class="article-item__wrapper p-4">
    <div class="article-item__data d-flex-col justify-sb align-start">
      <div class="image-upload p-relative w-100 mb-4">
        <input type="file" @change="handleFileUpload" ref="fileInput" />
        <div
          class="image-upload__card d-flex justify-center align-center p-relative"
          @click="triggerFileUpload"
          :class="{ 'has-image': imagePreview }"
        >
          <div v-if="!imagePreview" class="image-upload__placeholder">
            <span class="material-symbols-outlined">add_photo_alternate</span>
          </div>
          <img v-else :src="imagePreview" alt="Uploaded preview" class="image-upload__preview" />
          <div class="upload-icon p-absolute px-2 py-1">
            <span class="material-symbols-outlined">upgrade</span>
          </div>
        </div>
      </div>
      <div class="actions d-flex justify-end align-center w-100">
        <button
          :class="{ disabled: !imagePreview }"
          class="button button--secondary button--icon mr-2"
        >
          <span>{{ articleLabels.green }}</span>
          <span class="material-symbols-outlined"> {{ isNewArticle ? 'check' : 'upgrade' }} </span>
        </button>
        <button @click="removeArticle" class="button button--danger button--icon">
          <span>{{ articleLabels.red }}</span>
          <span class="material-symbols-outlined"> {{ isNewArticle ? 'close' : 'delete' }} </span>
        </button>
      </div>
    </div>
    <div class="article-item__content"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import type { PropType } from 'vue'
import { useModalStore } from '../../../../stores/modal'
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
    const modalStore = useModalStore()
    const imagePreview = ref<string | null>(null)
    const articleDataCopy = ref<ArticleData>({ ...props.articleData })

    const articleLabels = computed(() => {
      return props.isNewArticle
        ? { green: 'Save', red: 'Cancel' }
        : { green: 'Update', red: 'Delete' }
    })

    const handleFileUpload = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0]

      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          imagePreview.value = reader.result as string
        }
        reader.readAsDataURL(file)
      }
    }

    const triggerFileUpload = () => {
      const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]')
      fileInput?.click()
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

    return {
      articleLabels,
      imagePreview,
      handleFileUpload,
      triggerFileUpload,
      removeArticle,
    }
  },
})
</script>

<style lang="scss" scoped src="./ArticleItem.scss"></style>
