import { OrderService } from '@/http/index'
import router from '@/router/index'
import { not } from '@/util/index'
import Coupon from '@/models/Coupon'
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
  ORDERING_SUCCESS(state, flag) {
    state.orderingSuccess = flag
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
    commit('ORDERING_SUCCESS', true)
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
        commit('SET_ORDER_DETAIL', null)
        commit('ORDERING_SUCCESS', false)
        router.replace({ name: 'Menu' })
      })
      .catch(err => {
        commit('SHOW_LOADING', false)
        commit('SET_SELECTED_COUPON', null)
        commit('SET_ORDER_DETAIL', null)
        commit('ORDERING_SUCCESS', false)
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
        commit('RESET_SHOPPING_CART')
        router.push({ name: 'OrderSuccess' })
        commit('ORDERING_SUCCESS')
      })
      .catch(err => {
        commit('SHOW_LOADING', false)
        commit('RESET_SHOPPING_CART')
        router.push({ name: 'OrderFailed' })
        return Promise.reject(err)
      })
  },
  FETCH_ORDER: ({ commit, dispatch, rootState, state }, tradeNo) => {
    commit('SHOW_LOADING', true)

    return OrderService.getOrder(tradeNo)
      .then(order => {
        commit('SHOW_LOADING', false)
        commit('SET_ORDER_DETAIL', order)
        commit('SET_IS_VIP', order.isVip)
        return order
      })
      .then(_ => {
        return dispatch('FETCH_AVALIABLE_COUPONS')
      })
      .then(allCoupons => {
        // 根据订单价格 过滤出可用优惠券
        const predicate = e => {
          if (e.couponType === Coupon.REDUCE) {
            let orderPrice = state.orderDetail.totalPrice
            // 如果有配送费 则加上
            if (rootState.user.deliveryFeeValue) {
              orderPrice += +rootState.user.deliveryFeeValue
            }
            const couponValue = Number(e.value.split('-')[0])
            return orderPrice >= couponValue
          } else {
            return true
          }
        }

        const avaliableCoupons = allCoupons.filter(predicate)
        const disableCoupons = allCoupons.filter(
          not(predicate)
        )

        // 如果选中的优惠券 不在可用优惠券内 则置空选中优惠券
        if (rootState.coupon.selectedCoupon) {
          if (
            disableCoupons.find(
              e => e.couponKey === rootState.coupon.selectedCoupon.couponKey
            )
          ) {
            dispatch('SELECT_COUPON', null)
          }
        }
        commit('SET_AVALIABLE_COUPONS', avaliableCoupons)
        commit('SET_DISABLE_COUPONS', disableCoupons)
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
