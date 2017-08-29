import { OrderService } from '@/http/index'
import router from '@/router/index'
import { not } from '@/util/index'
import Coupon from '@/models/Coupon'
import QRCodeInfo from '@/models/QRCodeInfo'
import Vue from 'vue'

const state = {
  // {
  //   [tenantId]: OrderDetail,
  //   ...
  // }
  orderDetail: {},
  // {
  //   [tenantId]: Remark,
  //   ...
  // }
  orderRemark: {},
  dinersNum: 1,
  allOrders: []
}

const mutations = {
  SET_ORDER_DETAIL(state, order) {
    const tenantId = QRCodeInfo.getTenantId()
    Vue.set(state.orderDetail, tenantId, order)
  },
  SET_ORDER_REMARK(state, remark) {
    const tenantId = QRCodeInfo.getTenantId()
    Vue.set(state.orderRemark, tenantId, remark)
  },
  SET_DINERS_NUM(state, number) {
    state.dinersNum = number
  },
  SET_ALL_ORDERS(state, orders) {
    state.allOrders = orders
  }
}

const actions = {
  FETCH_ALL_ORDERS: ({ commit }, dateFormat) => {
    commit('SHOW_LOADING', true)
    return OrderService.getAllOrder(dateFormat)
    .then(orders => {
      commit('SHOW_LOADING', false)
      commit('SET_ALL_ORDERS', orders)
    })
    .catch(err => {
      commit('SHOW_LOADING', false)
    })
  },
  CHOOSE_PEOPLE_NUMBER: ({ commit, dispatch }, number) => {
    commit('SET_DINERS_NUM', number)
    return dispatch('ADD_ORDER')
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
    const tenantId = QRCodeInfo.getTenantId()

    return OrderService.delOrder(state.orderDetail[tenantId].tradeNo)
      .then(_ => {
        commit('SHOW_LOADING', false)
        commit('SET_SELECTED_COUPON', null)
        commit('SET_ORDER_DETAIL', null)
        router.replace({ name: 'Menu' })
      })
      .catch(err => {
        commit('SHOW_LOADING', false)
        commit('SET_SELECTED_COUPON', null)
        commit('SET_ORDER_DETAIL', null)
        router.replace({ name: 'Menu' })
        return Promise.reject(err)
      })
  },
  ADD_ORDER: ({ commit, state, rootState }) => {
    commit('SHOW_LOADING', true)
    const tenantId = QRCodeInfo.getTenantId()

    const params = {
      remark: state.orderRemark[tenantId],
      dinersNum: state.dinersNum
    }

    // 代售且商家有经纬度 添加配送费
    if (rootState.tenant.needDeliveryFee) {
      Object.assign(params, {
        deliveryFeeId: rootState.user.deliveryFeeId
      })
    }

    return OrderService.addOrder(params)
      .then(data => {
        commit('SHOW_LOADING', false)
        commit('RESET_SHOPPING_CART')
        router.push({ name: 'OrderSuccess' })
      })
      .catch(err => {
        commit('SHOW_LOADING', false)
        commit('RESET_SHOPPING_CART')
        router.push({ name: 'OrderFailed' })
        return Promise.reject(err)
      })
  },

  // TODO: 如果有配送费ID 根据配送费查询deliveryFee
  FETCH_ORDER: ({ commit, dispatch, rootState, state }, tradeNo) => {
    commit('SHOW_LOADING', true)
    const tenantId = QRCodeInfo.getTenantId()

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
          const orderDetail = state.orderDetail[tenantId]
          if (!orderDetail.canUseCoupon) {
            return false
          }
          if (e.couponType === Coupon.REDUCE) {
            let orderPrice = orderDetail.isVip ? orderDetail.totalVipPrice : orderDetail.totalPrice
            // 如果有配送费 则加上
            if (rootState.user.deliveryFeeValue) {
              orderPrice += +rootState.user.deliveryFeeValue
            }
            // 如果有优惠 则减去
            if (orderDetail.totalGoodsDiscount) {
              orderPrice -= orderDetail.totalGoodsDiscount
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
        // 初始化选中优惠券
        if (state.orderDetail[tenantId].couponKey) {
          const selectedCoupon = avaliableCoupons.find(e => e.couponKey === state.orderDetail[tenantId].couponKey)
          dispatch('SELECT_COUPON', selectedCoupon)
        } else {
          dispatch('SELECT_COUPON', null)
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
  orderDetail(state, getters) {
    return state.orderDetail[getters.tenantId]
  },
  allOrders(state) {
    return state.allOrders
  }
}

export { state, mutations, actions, getters }
