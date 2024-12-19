import { db } from '../config/firebase'
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { useNotificationStore } from '../stores/notification'
import type { ArticleData } from '@/types/content'

const articlesCollection = collection(db, 'articles')

export const fetchAllArticles = async (): Promise<ArticleData[]> => {
  const snapshot = await getDocs(articlesCollection)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as ArticleData[]
}

export const addNewArticle = async (article: ArticleData): Promise<void> => {
  const articleDoc = doc(articlesCollection, article.id)
  await setDoc(articleDoc, article)
}

export const updateExistingArticle = async (
  articleId: string,
  article: Partial<ArticleData>,
  isNewArticle: boolean,
): Promise<void> => {
  const articleDoc = doc(articlesCollection, articleId)
  await setDoc(articleDoc, article, { merge: true })

  const notificationStore = useNotificationStore()
  isNewArticle
    ? notificationStore.setNotification(`New article added successfully.`)
    : notificationStore.setNotification(`Article has been updated.`)
}

export const deleteArticleById = async (id: string): Promise<void> => {
  try {
    const articleRef = doc(db, 'articles', id)
    await deleteDoc(articleRef)

    const languagesSnapshot = await getDocs(collection(db, 'content'))
    const languages = languagesSnapshot.docs.map((doc) => doc.id)

    for (const language of languages) {
      const languageDocRef = doc(db, 'content', language)
      const languageDocSnapshot = await getDoc(languageDocRef)

      if (!languageDocSnapshot.exists()) continue
      const data = languageDocSnapshot.data()
      const articles = data.articles || []
      const updatedArticles = articles.filter((article: any) => article.articleId !== id)

      console.log(articles)

      if (articles.length === updatedArticles.length) continue
      await updateDoc(languageDocRef, { articles: updatedArticles })
    }

    const notificationStore = useNotificationStore()
    notificationStore.setNotification('Article has been successfully deleted')
  } catch (error) {
    console.error('Error deleting article and content:', error)
    throw error
  }
}
