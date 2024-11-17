import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    component: () => import('@/modules/user/LandingPage.vue'),
  },
  {
    path: '/auth',
    component: () => import('@/modules/auth/LoginPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/admin',
    component: () => import('@/modules/admin/AdminPanel.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.ready) {
    await authStore.fetchUser()
  }

  if (to.meta.requiresAuth && !authStore.user) {
    next('/auth')
  } else if (to.path === '/auth' && authStore.user) {
    next('/admin')
  } else {
    next()
  }
})

export default router
