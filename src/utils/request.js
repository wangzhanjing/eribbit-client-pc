// 1、创建一个新的axios实例,配置实例参数
import axios from 'axios'
import store from '@/store'
import router from '@/router'
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/' // 导出基本地址，其他地方可能不是这个基准地址
const instance = axios.create({
  baseURL,
  timeout: 5000
})
// 2、设置请求拦截器，如果有token进行携带
instance.interceptors.request.use((config) => {
  // 获取用户信息对象
  const { profile } = store.state.user
  if (profile.token) {
    config.headers.Authorization = `Bearer ${profile.token}`
  }
  return config
}, (err) => {
  return Promise.reject(err)
})
// 3、配置响应拦截器，剥离无效数据，处理token失效
instance.interceptors.response.use((res) => {
  return res.data
}, (err) => {
  if (err.response && err.response.state === 401) {
    // 清空本地无效信息，跳转到登录页，需要带参数，当前路由地址给登录页面，登录完成之后还要返回来
    store.commit('user/setUser', {})
    // 获取当前路由信息 因为这是在vue3中，路由信息对象(router.currentRoute)是响应式的，所以需要通过value拿到它的值
    const currentPath = encodeURIComponent(router.currentRoute.value.fullPath) // 路径上可能带两个参数，这时候需要对&进项转码才可以使用，防止解析地址出现问题
    router.push(`/login?redirectUrl${currentPath}`)
  }
  return Promise.reject(err)
})
// 4、导出一个函数，调用当前axios实例，返回值是promise
export default (url, method, submitData) => {
  // 请求地址，请求方式，请求参数
  return instance({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData // 动态设置key的属性
  })
}
