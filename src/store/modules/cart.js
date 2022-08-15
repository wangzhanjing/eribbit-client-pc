import { deleteCart, findCartList, getNewCartGoods, insertCart, mergeLocalCart, updateCart } from '@/api/cart'

export default {
  namespaced: true,
  // state () {
  //   return {
  //     list: []
  //   }
  // }
  state: {
    list: []
  },
  getters: {
    // 有效商品列表
    validList (state) {
      // 库存大于零，有效表示为true
      return state.list.filter(goods => goods.stock > 0 && goods.isEffective)
    },
    validTotal (state, getters) {
      return getters.validList.reduce((total, curr) => {
        return total + curr.count
      }, 0)
    },
    validPrice (state, getters) {
      return getters.validList.reduce((total, curr) => {
        return parseFloat(curr.nowPrice * curr.count) + total
      }, 0)
    },
    invalidList (state) {
      return state.list.filter(goods => !(goods.stock > 0 && goods.isEffective))
    },
    // 已选商品列表
    selectedList (state, getters) {
      return getters.validList.filter(item => item.selected)
    },
    // 已选商品总件数
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((total, curr) => {
        return total + curr.count
      }, 0)
    },
    // 已选商品总金额
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((total, curr) => {
        return parseFloat(curr.nowPrice * curr.count) + total
      }, 0)
    },
    // 是否全选
    isCheckedAll (state, getters) {
      // return getters.invalidList.some(item => item.selected === false)
      // console.log(getters.validList.length !== 0 && getters.selectedList.length === getters.validList.length)
      return getters.validList.length !== 0 && getters.selectedList.length === getters.validList.length
    }
  },
  mutations: {
    // 加入购物车
    insertCart (state, payload) {
      // 我需要哪些字段必须和后端保持一致
      // 如果有相同的商品，只增加数量，将他放在最前面
      const sameIndex = state.list.findIndex(item => item.skuId === payload.skuId)
      if (sameIndex > -1) {
        const count = state.list[sameIndex].count
        payload.count += count
        state.list.splice(sameIndex, 1)
      }
      state.list.unshift(payload)
    },
    // 修改购物车商品
    updateCart (state, goods) {
      // goods中字段有可能不完整，goods有的信息才去修改。
      // 1. goods中必须有skuId，才能找到对应的商品信息
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (const key in goods) {
        if (goods[key] !== null && goods[key] !== undefined && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },
    deleteCartItem (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
      console.log('删除成功')
    },
    // 设置购物车列表
    setCartList (state, list) {
      state.list = list
    }
  },
  actions: {
    // 合并本地购物车
    async mergeLocalCart (ctx) {
      // 存储token后调用合并API接口函数进行购物合并
      const cartList = ctx.state.list.map(({ skuId, selected, count }) => {
        return { skuId, selected, count }
      })
      await mergeLocalCart(cartList)
      // 合并成功将本地购物车删除
      ctx.commit('setCartList', [])
    },
    updateCartSku (context, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        // 判断是否登录
        if (context.rootState.user.profile.token) {
          resolve()
        } else {
          // 1、找出旧的商品信息，删除旧的商品信息
          // 2、根据新的商品信息，和旧的商品信息合并成新的商品信息
          // 3、将新的商品信息添加进去
          const oldGoods = context.state.list.find(goods => goods.skuId === oldSkuId)
          console.log(oldGoods)
          context.commit('deleteCartItem', oldSkuId)
          const { skuId, price: nowPrice, inventory: stock, specsText: attrsText } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, stock, attrsText }
          console.log(newGoods)
          context.commit('insertCart', newGoods)
          resolve()
        }
      })
    },
    updateCart (context, payload) {
      // payload 必须有skuId 和要修改的数据 selsected count
      return new Promise((resolve, reject) => {
        // 判断是否登录
        if (context.rootState.user.profile.token) {
          // 登录 TODO
          updateCart(payload).then(() => {
            return findCartList()
          }).then((data) => {
            context.commit('setCartList', data.result)
            resolve()
          })
          resolve()
        } else {
          context.commit('updateCart', payload)
          resolve()
        }
      })
    },
    // 做有效商品的全选&反选
    checkAllCart (context, selected) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 登录 TODO
        } else {
          // 本地
          // 1. 获取有效的商品列表，遍历的去调用修改mutations即可
          context.getters.validList.forEach(item => {
            context.commit('updateCart', { skuId: item.skuId, selected })
          })

          resolve()
        }
      })
    },
    insertCart (context, payload) {
      return new Promise((resolve, reject) => {
        // 判断是否登录
        if (context.rootState.user.profile.token) {
          // 登录 TODO
          insertCart(payload).then(() => {
            return findCartList()
          }).then((data) => {
            context.commit('setCartList', data.result)
            resolve()
          })
          resolve()
        } else {
          context.commit('insertCart', payload)
          resolve()
        }
      })
    },
    // 获取商品列表
    findCartList (context) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 登录 TODO
          findCartList().then(data => {
            context.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 同时发送请求，等所有结果成功，一起修改本地的数据
          const promiseArr = context.state.list.map(goods => {
            return getNewCartGoods(goods.skuId)
          })
          Promise.all(promiseArr).then(results => {
            results.forEach((item, index) => {
              context.commit('updateCart', { ...item.result, skuId: context.state.list[index].skuId })
            })
            resolve()
          })
        }
      })
    },
    deleteCartItem (context, payload) {
      return new Promise((resolve, reject) => {
        // 判断是否登录
        if (context.rootState.user.profile.token) {
          // 登录 TODO
          console.log(payload)
          deleteCart([payload]).then(() => {
            return findCartList()
          }).then((data) => {
            context.commit('setCartList', data.result)
            resolve()
          })
          resolve()
        } else {
          context.commit('deleteCartItem', payload)
          resolve()
        }
      })
    },
    batchDeleteCartItem (context, isClear) {
      return new Promise((resolve, reject) => {
        // 判断是否登录
        if (context.rootState.user.profile.token) {
          // 登录 TODO
          // 得到需要删除的商品列表（失效，选中）的skuId集合
          const ids = context.getters[isClear ? 'invalidList' : 'selectedList'].map(item => item.skuId)
          deleteCart(ids).then(() => {
            return findCartList()
          }).then((data) => {
            context.commit('setCartList', data.result)
            resolve()
          })
          resolve()
        } else {
          context.getters.selectedList.forEach(item => {
            context.commit('deleteCartItem', item.skuId)
          })

          resolve()
        }
      })
    }
  }

}
