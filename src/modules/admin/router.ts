import type { RouteRecordRaw } from 'vue-router'
import Content from './content/Content.vue'
import Videos from './videos/Videos.vue'
import Images from './images/Images.vue'
import Artists from './artists/Artists.vue'

export const AdminRoutes: Array<RouteRecordRaw> = [
  {
    path: '/admin/content',
    name: 'content',
    component: Content,
  },
  {
    path: '/admin/videos',
    name: 'videos',
    component: Videos,
  },
  {
    path: '/admin/images',
    name: 'images',
    component: Images,
  },
  {
    path: '/admin/artists',
    name: 'artists',
    component: Artists,
  },
]
