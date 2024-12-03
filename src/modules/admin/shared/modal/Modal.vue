<template>
  <div
    :class="{ visible: isModalActive }"
    class="modal__wrapper p-absolute w-100 h-100 d-flex justify-center align-center"
  >
    <div class="modal__inner d-flex-col justify-center align-center p-6">
      <span class="material-symbols-outlined warning"> warning </span>
      <h4 class="mb-4">Warning!</h4>
      <div v-html="message" class="modal__message text-center mb-6"></div>
      <div class="modal__actions mt-2">
        <button @click="confirm" class="button button--success mr-2">Yes</button>
        <button @click="closeModal" class="button button--danger">No</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useModalStore } from '../../../../stores/modal'

export default defineComponent({
  setup() {
    const modalStore = useModalStore()
    const isModalActive = ref(false)
    const message = ref('')

    const closeModal = () => {
      modalStore.setConfirmation(false)
    }

    const confirm = () => {
      modalStore.setConfirmation(true)
    }

    watch(
      () => modalStore.isModalActive,
      () => {
        isModalActive.value = modalStore.isModalActive
      },
    )

    watch(
      () => modalStore.modalMessage,
      () => {
        message.value = modalStore.modalMessage
      },
    )

    return {
      isModalActive,
      message,
      closeModal,
      confirm,
    }
  },
})
</script>

<style lang="scss" scoped src="./Modal.scss"></style>
