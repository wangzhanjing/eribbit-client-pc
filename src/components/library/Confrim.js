// 1、导入需要被创建的组件
// 2、使用createVNode创建一个虚拟节点
// 3、准备一个dom容器装组件
// 4、使用render函数渲染组件
import { createVNode, render } from 'vue'
import XtxConfirm from './xtx-confirm'

const div = document.createElement('div')
div.setAttribute('class', 'xtx-confirm-container')
document.body.append(div)
export default ({ text, title }) => {
  return new Promise((resolve, reject) => {
    const cancle = () => {
      render(null, div)
      reject(new Error('点击了取消！'))
    }

    const submit = () => {
      render(null, div)
      resolve()
    }
    const vnode = createVNode(XtxConfirm, { text, title, cancle, submit })
    render(vnode, div)
  })
}
