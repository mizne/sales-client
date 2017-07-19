import { OrderService } from '@/http/index'
import storage from '@/util/storage'
import router from '@/router/index'

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
        tenantId: storage.get('tenantId'),
        consigneeId: storage.get('consigneeId'),
        tableName: storage.get('tableName'),
        phoneNumber: storage.get('phoneNumber')
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
        router.push({ name: 'Menu' })
      })
      .catch(err => {
        commit('SHOW_LOADING', false)
        router.push({ name: 'Menu' })
        return Promise.reject(err)
      })
  },
  ADD_ORDER: ({ commit, state, rootState }) => {
    router.push({ name: 'Ordering' })
    const params = {
      remark: state.orderRemark,
      dinersNum: state.dinersNum
    }

    if (rootState.coupon.selectedCoupon) {
      Object.assign(params, {
        couponKey: rootState.coupon.selectedCoupon.couponKey
      })
    }

    return OrderService.addOrder(params)
      .then(data => {
        commit('ORDERING_SUCCESS')
      })
      .catch(err => {
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
