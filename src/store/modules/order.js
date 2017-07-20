import { OrderService } from '@/http/index'
import router from '@/router/index'
import QRCodeInfo from '@/models/QRCodeInfo'

const state = {
  orderDetail: null,
  orderRemark: '',
  orderingSuccess: false,
  dinersNum: 1
}

const mutations = {
  SET_ORDER_DETAIL(state, order) {
    state.orderDetail = order
  },
  SET_ORDER_REMARK(state, remark) {
    state.orderRemark = remark
  },
  ORDERING_SUCCESS(state) {
    state.orderingSuccess = true
  },
  SET_DINERS_NUM(state, number) {
    state.dinersNum = number
  }
}

const actions = {
  CHOOSE_PEOPLE_NUMBER: ({ commit, dispatch }, number) => {
    commit('SET_DINERS_NUM', number)
    return dispatch('ADD_ORDER')
  },
  ORDERING_SUCCESS: ({ commit }) => {
    commit('ORDERING_SUCCESS')
    commit('RESET_SHOPPING_CART')
  },
  EDIT_ORDER: ({ commit, dispatch }, foodParams) => {
    commit('SHOW_LOADING', true)

    const params = {
      condition: {
        tenantId: QRCodeInfo.getTenantId(),
        consigneeId: QRCodeInfo.getConsigneeId(),
        tableName: QRCodeInfo.getTableName(),
        phoneNumber: QRCodeInfo.getPhoneNumber()
      },
      food: foodParams
    }
    return OrderService.editOrder(params).then(_ => dispatch('FETCH_ORDER'))
  },
  CANCEL_ORDER: ({ commit, state }) => {
    commit('SHOW_LOADING', true)

    return OrderService.delOrder(state.orderDetail.tradeNo)
      .then(_ => {
        commit('SHOW_LOADING', false)
        commit('SET_SELECTED_COUPON', null)
        router.replace({ name: 'Menu' })
      })
      .catch(err => {
        commit('SHOW_LOADING', false)
        commit('SET_SELECTED_COUPON', null)
        router.replace({ name: 'Menu' })
        return Promise.reject(err)
      })
  },
  ADD_ORDER: ({ commit, state, rootState }) => {
    commit('SHOW_LOADING', true)
    // router.push({ name: 'Ordering' })
    const params = {
      remark: state.orderRemark,
      dinersNum: state.dinersNum
    }

    // 代售 添加配送费
    if (QRCodeInfo.isEShopBizType()) {
      Object.assign(params, {
        deliveryFeeId: rootState.user.deliveryFeeId
      })
    }

    return OrderService.addOrder(params)
      .then(data => {
        commit('SHOW_LOADING', false)
        router.push({ name: 'OrderSuccess' })
        commit('ORDERING_SUCCESS')
      })
      .catch(err => {
        commit('SHOW_LOADING', false)
        router.push({ name: 'OrderFailed' })
        return Promise.reject(err)
      })
  },
  FETCH_ORDER: ({ commit }, tradeNo) => {
    commit('SHOW_LOADING', true)

    return OrderService.getOrder(tradeNo)
      .then(order => {
        commit('SHOW_LOADING', false)
        commit('SET_ORDER_DETAIL', order)
        // if (order.foods.length === 0) {
        //   router.push({ name: 'Menu' })
        // }
        commit('SET_IS_VIP', order.isVip)
        return order
      })
      .catch(err => {
        commit('SHOW_LOADING', false)
        return Promise.reject(err)
      })
  }
}

const getters = {
  orderDetail(state) {
    return state.orderDetail
  },
  orderingSuccess(state) {
    return state.orderingSuccess
  }
}

export { state, mutations, actions, getters }
