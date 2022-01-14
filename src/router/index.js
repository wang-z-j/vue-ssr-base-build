import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/pages/Home.vue'
Vue.use(VueRouter)
export const createRouter = () => {
  const router = new VueRouter({
    mode: 'history', // 兼容前后端
    routes: [
      {
        name: 'home',
        path:'/',
        component: Home
      },
      {
        name: 'about',
        path:'/about',
        component: () => import('@/pages/About.vue')
      },
      {
        name: 'posts',
        path:'/posts',
        component: () => import('@/pages/Posts.vue')
      },
      {
        name: 'error404',
        path:'*',
        component: () => import('@/pages/404.vue')
      },
    ]
  })
  return router
}
