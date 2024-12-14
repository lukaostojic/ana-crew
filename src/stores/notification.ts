import { defineStore } from 'pinia'
import { ref } from 'vue'

export const NOTIFICATION_TIMEOUT = 5000

export const useNotificationStore = defineStore('notification', () => {
  const isLoading = ref(false)
  const notification = ref<string>('')

  const setNotification = (newNotification: string) => {
    notification.value = newNotification
    setTimeout(() => {
      notification.value = ''
    }, NOTIFICATION_TIMEOUT)
  }

  return {
    isLoading,
    notification,
    setNotification,
  }
})
