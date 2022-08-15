// 用户模块
export default {
  namespaced: true,
  state: {
    profile: {
      id: '',
      avatar: '',
      nickname: '',
      accout: '',
      mobile: '',
      token: ''
    },
    // 登录后跳转的路径
    redirectUrl: ''
  },
  mutations: {
    setUser (state, user) {
      state.profile = user
    },
    setRedirectUrl (state, url) {
      state.redirectUrl = url
    }
  }
}
