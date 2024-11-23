<template>
  <div
    :class="{ visible: showNotification }"
    class="notification__wrapper p-relative p-3 text-center"
  >
    <h4 class="mb-3">Success!</h4>
    <div class="notification__inner" v-html="notificationContent"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useNotificationStore } from '../../../../stores/notification'
import { NOTIFICATION_TIMEOUT } from '../../../../stores/notification'

export default defineComponent({
  name: 'Notification',

  setup() {
    const notificationStore = useNotificationStore()
    const notificationContent = ref('')
    const showNotification = ref(false)

    watch(
      () => notificationStore.notification,
      () => {
        showNotification.value = true
        notificationContent.value = notificationStore.notification

        setTimeout(() => {
          showNotification.value = false
        }, NOTIFICATION_TIMEOUT)
      },
    )

    return {
      notificationContent,
      showNotification,
    }
  },
})
</script>

<style lang="scss" scoped src="./Notification.scss"></style>
