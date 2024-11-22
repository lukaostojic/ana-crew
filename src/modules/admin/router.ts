import type { RouteRecordRaw } from 'vue-router'
import Content from './content/Content.vue'
import Videos from './videos/Videos.vue'
import Images from './images/Images.vue'
import Artists from './artists/Artists.vue'
import PhotoGalleries from './photo-galleries/PhotoGalleries.vue'

export const AdminRoutes: Array<RouteRecordRaw> = [
  {
    path: '/admin/content',
    name: 'Content',
    component: Content,
  },
  {
    path: '/admin/videos',
    name: 'Videos',
    component: Videos,
  },
  {
    path: '/admin/images',
    name: 'images',
    component: Images,
  },
  {
    path: '/admin/artists',
    name: 'Artists',
    component: Artists,
  },
  {
    path: '/admin/galleries',
    name: 'Photo Galleries',
    component: PhotoGalleries,
  },
]
