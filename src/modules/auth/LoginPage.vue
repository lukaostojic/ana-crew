<template>
  <div class="login__wrapper d-flex justify-center align-center w-100">
    <div class="login__inner px-4 py-4">
      <h2 class="mb-6">Login</h2>
      <form @submit.prevent="handleLogin" class="d-flex-col align-center">
        <input v-model="email" type="email" placeholder="Email" required class="input w-100 mb-2" />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
          class="input w-100 mb-6"
        />
        <button type="submit" class="button button--primary mb-2">Login</button>
      </form>
      <div class="d-flex justify-center">
        <button @click="leaveAdminSection" class="button button--primary">
          Leave Admin Section
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../config/firebase'

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const email = ref('')
    const password = ref('')
    const router = useRouter()

    const handleLogin = async () => {
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value)
        router.push('/admin')
      } catch (error) {
        console.error('Login failed:', error)
      }
    }

    const leaveAdminSection = async () => {
      router.push('/')
    }

    return { email, password, handleLogin, leaveAdminSection }
  },
})
</script>

<style lang="scss" scoped src="./LoginPage.scss"></style>
