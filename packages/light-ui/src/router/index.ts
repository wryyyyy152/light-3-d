import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/home',
      component: () => import('../views/home/index.vue')
    },
    {
      path: '/editor',
      component: () => import('../views/editor/index.vue')
    },
    {
      path: '/test3',
      component: () => import('../views/home/LanguageSelector.vue')
    },
  ]
})

export default router