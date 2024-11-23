import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('modal', () => {
  const isModalActive = ref(false)
  const modalMessage = ref('')
  const resolveAction = ref<((value: boolean) => void) | null>(null)

  const setIsModalActive = (isActive: boolean) => {
    isModalActive.value = isActive
  }

  const setModalMessage = (message: string) => {
    modalMessage.value = message
  }

  const setConfirmation = (confirmation: boolean) => {
    if (resolveAction.value) {
      resolveAction.value(confirmation)
      resolveAction.value = null
    }
    isModalActive.value = false
  }

  const showConfirmationModal = (message: string): Promise<boolean> => {
    modalMessage.value = message
    isModalActive.value = true
    return new Promise((resolve) => {
      resolveAction.value = resolve
    })
  }

  return {
    isModalActive,
    modalMessage,
    setIsModalActive,
    setModalMessage,
    setConfirmation,
    showConfirmationModal,
  }
})
