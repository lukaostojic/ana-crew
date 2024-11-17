import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth } from '@/config/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { getIdToken } from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const token = ref(localStorage.getItem('authToken') || null)
  const ready = ref(false)

  const fetchUser = () => {
    return new Promise<void>((resolve) => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        user.value = firebaseUser

        if (firebaseUser) {
          const idToken = await getIdToken(firebaseUser)
          token.value = idToken
          localStorage.setItem('authToken', idToken)
        } else {
          token.value = null
          localStorage.removeItem('authToken')
        }
        ready.value = true
        resolve()
      })
    })
  }

  const logout = async () => {
    await signOut(auth)
    user.value = null
    token.value = null
    ready.value = false
    localStorage.removeItem('authToken')
  }

  return { user, token, ready, fetchUser, logout }
})
