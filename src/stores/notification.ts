import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const isLoading = ref(false)
  const notification = ref('')

  const setNotification = (newNotification: any) => {
    notification.value = newNotification
  }

  return {
    isLoading,
    notification,
    setNotification,
  }
})
