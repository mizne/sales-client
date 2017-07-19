const state = {
  loading: false
}

const mutations = {
  SHOW_LOADING(state, load) {
    if (load === true) {
      state.loading = load
    } else {
      // 延迟loading动画的消失 防止太快出现=>消失 体验不好
      setTimeout(() => {
        state.loading = load
      }, 300)
    }
  }
}

const actions = {}

const getters = {
  loading(state) {
    return state.loading
  }
}

export { state, mutations, actions, getters }
