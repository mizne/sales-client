import { CommentService } from '@/http/index'
import QRCodeInfo from '@/models/QRCodeInfo'
import Vue from 'vue'

const state = {
  // {
  //   [tenantId]: Comments,
  //   ...
  // }
  shopComments: {},
}

const mutations = {
  SET_SHOP_COMMENT(state, shopComments) {
    const tenantId = QRCodeInfo.getTenantId()
    Vue.set(state.shopComments, tenantId, shopComments)
  },
}

const actions = {
  FETCH_SHOP_COMMENT: ({ commit }) => {
    return CommentService.getShopComment().then(shopComments => {
      commit('SET_SHOP_COMMENT', shopComments)
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
  shopComments(state, getters) {
    return state.shopComments[getters.tenantId] || []
  }
}

export { state, mutations, actions, getters }
