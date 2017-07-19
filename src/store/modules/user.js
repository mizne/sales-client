import { UserService } from '@/http/index'

const state = {
  isVip: false
}

const mutations = {
  SET_IS_VIP(state, isVip) {
    state.isVip = isVip
  }
}

const actions = {
  FETCH_USER_STATUS: ({ commit }) => {
    return UserService.getStatus().then(status => {
      commit('SET_IS_VIP', status.isVip)
      return status
    })
  }
}

const getters = {
  isVip(state) {
    return state.isVip
  }
}

export { state, mutations, actions, getters }
