import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入组件库
import UI from '@/components/library'
import 'normalize.css' // 样式重置的包
import '@/assets/styles/common.less'

createApp(App).use(store).use(router).use(UI).mount('#app')
