import { CommentService } from '@/http/index'
import storage from '@/util/storage'

const state = {
  shopComments: [],
}

const mutations = {
  SET_SHOP_COMMENT(state, shopComments) {
    state.shopComments = shopComments
  },
}

const actions = {
  FETCH_SHOP_COMMENT: ({ commit }) => {
    return CommentService.getShopComment().then(merchantRatings => {
      commit('SET_SHOP_COMMENT', merchantRatings)
    })
  },

  ADD_SHOP_COMMENT: ({ commit }, params) => {
    return CommentService.addShopComment(params)
  },

  ADD_FOOD_COMMENT: ({ commit }, params) => {
    return CommentService.addFoodComment(params)
  }
}

const getters = {
  shopComments(state) {
    return state.shopComments
  }
}

export { state, mutations, actions, getters }
