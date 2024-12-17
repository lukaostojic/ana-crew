import { db } from '../config/firebase'
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'
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

export const deleteArticleById = async (articleId: string): Promise<void> => {
  const articleDoc = doc(articlesCollection, articleId)
  await deleteDoc(articleDoc)

  const notificationStore = useNotificationStore()
  notificationStore.setNotification(`Article has been successfully deleted.`)
}
