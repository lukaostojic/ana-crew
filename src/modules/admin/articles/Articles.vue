<template>
  <div class="articles__wrapper mt-4 px-4">
    <div class="articles__add-button d-flex justify-end align-center p-relative">
      <button
        @click="handleAddNewArticle"
        :class="{ disabled: isNewArticle || isActionInProgress }"
        class="button button--secondary button--icon p-absolute add"
      >
        <span>Add Article</span>
        <span class="material-symbols-outlined"> add </span>
      </button>
    </div>
    <div
      v-if="articlesData.length === 0"
      class="articles__no-articles d-flex justify-center align-center"
    >
      <div class="d-flex-col align-center">
        <p>No Articles added</p>
        <span class="material-symbols-outlined no-article"> edit_off </span>
      </div>
    </div>
    <div v-else class="articles__list pb-5">
      <div v-for="(articleData, index) in reversedArticlesData" :key="articleData.id">
        <ArticleItem
          :allArticles="articlesData"
          :articleData="articleData"
          :articleContent="articlesContent[articlesData.length - 1 - index]"
          :isNewArticle="isNewArticle"
          @update-article-data="updateArticleData(articlesData.length - 1 - index, $event)"
          @update-article-content="updateArticleContent(articlesData.length - 1 - index, $event)"
          @remove-article="deleteArticle($event)"
          :class="{ disabled: isNewArticle && index !== 0 }"
          class="list-item"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from 'vue'
import { generateUniqueId } from '../../../helpers/helper-functions'
import { uploadImage, deleteImage } from '../../../services/image.service'
import { useArticlesStore } from '../../../stores/articles'
import { useLocalizationStore } from '../../../stores/localization'
import type { ArticleData, ArticleContent } from '../../../types/content'
import ArticleItem from './article-item/ArticleItem.vue'

export default defineComponent({
  name: 'Articles',
  components: { ArticleItem },
  props: {
    content: Object,
  },
  setup(props, { emit }) {
    const articlesStore = useArticlesStore()
    const localizationStore = useLocalizationStore()
    const isNewArticle = ref()
    const isActionInProgress = ref(false)
    const articlesData = ref<ArticleData[]>([])
    const articlesContent = ref<ArticleContent>({ ...props.content?.articles })

    const reversedArticlesData = computed(() => [...articlesData.value].reverse())

    const handleAddNewArticle = () => {
      const articleId = generateUniqueId()
      const newArticle: ArticleData = {
        id: articleId,
        imageUrl: '',
        deleteUrl: '',
        link: '',
      }

      articlesData.value.push(newArticle)
      isNewArticle.value = true
    }

    const updateArticleData = async (index, data) => {
      const article = articlesStore.allArticles[index]

      if (!article) {
        console.error(`No article found at index ${index}`)
        return
      }

      try {
        isActionInProgress.value = true

        if (data.link) {
          article.link = data.link
          await articlesStore.updateArticle(article, isNewArticle.value)
        }

        if (data.imageSource) {
          const image = await uploadImage(data.imageSource)

          if (image?.url && image?.delete_url) {
            article.imageUrl = image.url
            article.deleteUrl = image.delete_url

            await articlesStore.updateArticle(article, isNewArticle.value)
          } else {
            console.error('Image upload failed')
          }
        }
      } catch (error) {
        console.error('Failed to update article:', error)
      } finally {
        isNewArticle.value = false
        isActionInProgress.value = false
      }
    }

    const updateArticleContent = (index: number, updatedContent: ArticleContent) => {
      const articleId = articlesData.value[index]?.id
      updatedContent.articleId = articleId
      articlesContent.value[index] = updatedContent
      emit('update-content', { articles: articlesContent.value })
    }

    const deleteArticle = async (id: string) => {
      if (!isNewArticle.value) await articlesStore.deleteArticle(id)

      articlesData.value = articlesData.value.filter((v: ArticleData) => v.id !== id)
      isNewArticle.value = false
    }

    watch(
      () => articlesStore.allArticles,
      (newVal) => {
        articlesData.value = newVal
      },
      { deep: true, immediate: true },
    )

    watch(
      () => localizationStore.content.articles,
      (newVal) => {
        if (localizationStore.content.articles) {
          articlesContent.value = newVal
        }
      },
      { deep: true, immediate: true },
    )

    onMounted(() => {
      articlesStore.getAllArticles()
    })

    return {
      isNewArticle,
      articlesData,
      reversedArticlesData,
      articlesContent,
      isActionInProgress,
      handleAddNewArticle,
      updateArticleData,
      updateArticleContent,
      deleteArticle,
    }
  },
})
</script>

<style lang="scss" scoped src="./Articles.scss"></style>
