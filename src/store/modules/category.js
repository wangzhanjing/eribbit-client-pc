import { topCategory } from '@/api/constants'
import { findAllCategory } from '@/api/category'

export default {
  namespaced: true,
  // state () {
  //   return {
  //     list: topCategory.map(item => ({ name: item }))
  //   }
  // },
  state: {
    list: topCategory.map(item => ({ name: item }))
  },
  mutations: {
    setCategory (state, payload) {
      state.list = payload
    },
    // 控制当前类名下二级分类的显示与隐藏
    show (state, id) {
      const currCartgory = state.list.find(item => item.id === id)
      // console.log('show')
      currCartgory.open = true
    },
    hidden (state, id) {
      const currCartgory = state.list.find(item => item.id === id)
      // console.log('hidden')
      currCartgory.open = false
    }
  },
  actions: {
    async getCategoryList (context) {
      const { result } = await findAllCategory()
      result.forEach(item => {
        item.open = false
      })
      context.commit('setCategory', result)
    }
  }
}
