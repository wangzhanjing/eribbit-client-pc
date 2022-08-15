
// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：没有全局过滤器。
// 这就是插件
// vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展

// import XtxSkeleton from './xtx-skeleton'
// import XtxCarousel from './xtx-carousel'
// import XtxMore from './xtx-more'
// import XtxBread from './xtx-bread'
// import XtxBreadItem from './xtx-bread-item'
import defaultImg from '@/assets/images/200.png'
import Message from './Message'
import XtxConfirm from './xtx-confirm'

const importFn = require.context('./', false, /\.vue$/)
export default {
  install (app) {
    // 在app上进行扩展，app提供 component directive 函数
    // 如果要挂载原型 app.config.globalProperties 方式
    // app.component(XtxSkeleton.name, XtxSkeleton)
    // app.component(XtxCarousel.name, XtxCarousel)
    // app.component(XtxMore.name, XtxMore)
    // app.component(XtxBread.name, XtxBread)
    // app.component(XtxBreadItem.name, XtxBreadItem)
    importFn.keys().forEach(path => {
      const component = importFn(path).default
      app.component(component.name, component)
    })
    // 定义指令
    defineDirective(app)

    // 定义一个原型函数
    app.config.globalProperties.$message = Message
    app.config.globalProperties.$confirm = XtxConfirm
  }
}

const defineDirective = (app) => {
  // 图片懒加载指令 v-lazy 原理，先存储地址不放在src上，当图片进入可视区，将src的地址设置给图片元素
  app.directive('lazy', {
    // vue2.0 inserted  DOM元素创建完毕
    // vue3.0 mounted  指令所拥有的钩子函数和组件的一样
    mounted (el, banding) {
      // 创建一个观察对象，来观察当前指令的元素
      const observe = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          // 进入可视区域之后就可以停止观察
          observe.unobserve(el)
          // 把指令的值，设置给图片的src属性,banding.value就是绑定指令的值
          // 图片加载失败 error时间  load是加载完毕属性
          el.onerror = () => {
            el.src = defaultImg
          }
          el.src = banding.value
        }
      }, {
        threshold: 0
      })
      observe.observe(el)
    }
  })
}
