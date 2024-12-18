import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  fetchAllArticles,
  addNewArticle,
  updateExistingArticle,
  deleteArticleById,
} from '@/services/article.service'
import { deleteImage } from '@/services/image.service'
import type { ArticleData } from '@/types/content'

export const useArticlesStore = defineStore('articles', () => {
  const allArticles = ref<any[]>([])

  const getAllArticles = async () => {
    try {
      const articles = await fetchAllArticles()
      allArticles.value = articles
    } catch (error) {
      console.error('Failed to load articles:', error)
    }
  }

  const addArticle = async (article: ArticleData) => {
    try {
      await addNewArticle(article)
      allArticles.value.push(article)
    } catch (error) {
      console.error('Failed to add article:', error)
      throw error
    }
  }

  const updateArticle = async (articleData: ArticleData, isNewArticle: boolean) => {
    try {
      const { id, deleteUrl, imageUrl, link } = articleData

      await updateExistingArticle(id, { deleteUrl, imageUrl, link }, isNewArticle)
      const articleIndex = allArticles.value.findIndex((article) => article.id === articleData.id)
      if (articleIndex > -1) {
        allArticles.value[articleIndex] = articleData
      }
    } catch (error) {
      console.error('Failed to update article:', error)
      throw error
    }
  }

  const deleteArticle = async (articleId: string) => {
    try {
      await deleteArticleById(articleId)
      allArticles.value = allArticles.value.filter((article) => article.id !== articleId)
    } catch (error) {
      console.error('Failed to delete article:', error)
      throw error
    }
  }

  return {
    getAllArticles,
    addArticle,
    updateArticle,
    deleteArticle,
    allArticles,
  }
})
