<template>
  <div class="articles__wrapper px-4">
    <div class="articles__add-button d-flex justify-end align-center p-relative">
      <button
        @click="handleAddNewArticle"
        :class="{ disabled: isNewArticle }"
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
import { defineComponent, ref, computed } from 'vue'
import { generateUniqueId } from '../../../helpers/helper-functions'
import type { ArticleData, ArticleContent } from '../../../types/content'
import ArticleItem from './article-item/ArticleItem.vue'

export default defineComponent({
  name: 'Articles',
  components: { ArticleItem },
  props: {
    content: Object,
  },
  setup(props) {
    const isNewArticle = ref()
    const articlesData = ref<ArticleData[]>([])
    const articlesContent = ref<ArticleContent>({ ...props.content?.videos })

    const reversedArticlesData = computed(() => [...articlesData.value].reverse())

    const handleAddNewArticle = () => {
      const articleId = generateUniqueId()
      const newArticle: ArticleData = {
        id: articleId,
        imageUrl: '',
      }

      articlesData.value.push(newArticle)
      isNewArticle.value = true
    }

    const updateArticleData = (index: number, updatedData: ArticleData) => {}

    const updateArticleContent = (index: number, updatedContent: ArticleContent) => {}

    const deleteArticle = async (id: string) => {
      // if (!isNewArticle.value) await removeVideo(id)

      articlesData.value = articlesData.value.filter((v: ArticleData) => v.id !== id)
      isNewArticle.value = false
    }

    return {
      isNewArticle,
      articlesData,
      reversedArticlesData,
      articlesContent,
      handleAddNewArticle,
      updateArticleData,
      updateArticleContent,
      deleteArticle,
    }
  },
})
</script>

<style lang="scss" scoped src="./Articles.scss"></style>
