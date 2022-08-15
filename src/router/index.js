import { createRouter, createWebHashHistory } from 'vue-router'

const Layout = () => import('@/views/Layout.vue')
const Home = () => import('@/views/home')

const TopCartgory = () => import('@/views/category/index.vue')
const SubCartgory = () => import('@/views/category/sub.vue')
const Goods = () => import('@/views/goods/index.vue')
const Login = () => import('@/views/login/index.vue')
const LoginCallback = () => import('@/views/login/callback')
const XtxCartPage = () => import('@/views/cart/index.vue')

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        component: Home
      },
      {
        path: '/category/:id',
        component: TopCartgory
      },
      {
        path: '/category/sub/:id',
        component: SubCartgory
      },
      {
        path: '/product/:id',
        component: Goods
      },
      {
        path: '/cart',
        component: XtxCartPage
      }
    ]
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/login/callback',
    component: LoginCallback
  }
]

const router = createRouter({
  // 使用hash路由模式
  history: createWebHashHistory(),
  routes,
  scrollBehavior () {
    return { left: 0, top: 0 }
  }
})

export default router
