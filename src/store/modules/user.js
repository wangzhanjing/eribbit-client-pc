// 用户模块
export default {
  status () {
    return {
      profile: {
        id: '',
        avatar: '',
        nickname: '',
        accout: '',
        mobile: '',
        token: ''

      }
    }
  },
  mutations: {
    setUser (state, user) {
      state.profile = user
    }
  }
}
