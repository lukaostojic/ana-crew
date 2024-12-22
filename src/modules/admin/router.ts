import type { RouteRecordRaw } from 'vue-router'
import Content from './content/Content.vue'
import Videos from './videos/Videos.vue'
import Artists from './artists/Artists.vue'
import Articles from './articles/Articles.vue'
import Contact from './contact/Contact.vue'

export const AdminRoutes: Array<RouteRecordRaw> = [
  {
    path: '/admin/content',
    name: 'Text',
    component: Content,
  },
  {
    path: '/admin/videos',
    name: 'Videos',
    component: Videos,
  },
  {
    path: '/admin/artists',
    name: 'Artists',
    component: Artists,
  },
  {
    path: '/admin/articles',
    name: 'Articles',
    component: Articles,
  },
  {
    path: '/admin/contact',
    name: 'Contact',
    component: Contact,
  },
]
