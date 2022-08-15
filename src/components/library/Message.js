// 提供一个能够显示提示框的组件
// 这个函数将来可以通过导入直接使用，也可以挂载在vue的实例原型上
// import Message from 'Message.js'  Message({type:'', text:''})
// this.$message({type:'', text:''})

// 渲染组件
// 1、导入消息提示组件
import { createVNode, render } from 'vue'
import XtxMessage from './xtx-message'

// 3、准备一个消息提示组件容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-message-container')
document.body.append(div)

let timer = null
export default ({ type, text }) => {
  // 2、将单文件vue组件转换为虚拟节点
  // 第一个参数 哪个组件  第二个参数  参数对象props
  const vnode = createVNode(XtxMessage, { type, text })

  // 4、将虚拟节点渲染在容器之中
  // 参数一 虚拟节点  参数二 DOM容器
  render(vnode, div)
  // 5、2s后销毁组件
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 2000)
}
