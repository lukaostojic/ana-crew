<template>
  <div class="admin__header d-flex justify-sb align-center px-4 py-4 w-100">
    <h2>Admin Panel</h2>
    <!-- <ul>
      <li v-for="user in users" :key="user.id">{{ user.email }}</li>
    </ul> -->
    <button @click="logout" class="button button--primary">Logout</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { db } from '../../config/firebase'
import { collection, getDocs } from 'firebase/firestore'

type IUser = {
  id: string
  email?: string
}

export default defineComponent({
  name: 'AdminPanel',
  setup() {
    const users = ref<IUser[]>([])
    const router = useRouter()
    const authStore = useAuthStore()

    onMounted(async () => {
      const usersCollection = collection(db, 'users')
      const snapshot = await getDocs(usersCollection)
      users.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      console.log('Users fetched:', users.value)
    })

    const logout = async () => {
      await authStore.logout()
      router.push('/auth')
    }

    return {
      users,
      logout,
    }
  },
})
</script>

<style lang="scss" scoped src="./AdminPanel.scss"></style>
