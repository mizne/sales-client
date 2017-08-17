import { UserService, Logger } from '@/http/index'
import { vAlert } from '@/util/vux-wrapper'
import QRCodeInfo from '@/models/QRCodeInfo'
import { fetchUserPostion, computeDistanceBetween } from '@/util/index'

const state = {
  isVip: false, // 是否vip
  deliveryFeeId: '', // 配送id
  deliveryFeeValue: '', // 配送费
  deliveryTime: '', // 配送所需时间
  deliveryDistance: 0, // 配送距离
  startPrice: '', // 起送价格
  distanceTooFar: false,
  tabIndex: 0,
  userLatitude: '', // 用户GPS纬度
  userLongitude: '' // 用户GPS经度
}

const mutations = {
  SET_TAB_INDEX(state, index) {
    state.tabIndex = index
  },
  SET_IS_VIP(state, isVip) {
    state.isVip = isVip
  },
  SET_DELIVERY_FEE_ID(state, id) {
    state.deliveryFeeId = id
  },
  SET_DELIVERY_FEE_VALUE(state, value) {
    state.deliveryFeeValue = value
  },
  SET_DELIVERY_TIME(state, time) {
    state.deliveryTime = time
  },
  SET_DELIVERY_DISTANCE(state, distance) {
    state.deliveryDistance = distance
  },
  SET_START_PRICE(state, price) {
    state.startPrice = price
  },
  SET_DISTANCE_TOO_FAR(state, flag) {
    state.distanceTooFar = flag
  },
  SET_USER_LATITUDE(state, lat) {
    state.userLatitude = lat
  },
  SET_USER_LONGITUDE(state, lng) {
    state.userLongitude = lng
  }
}

const actions = {
  FETCH_USER_STATUS: ({ commit, dispatch }) => {
    return Promise.all([
      UserService.getStatus(),
      dispatch('FETCH_AVALIABLE_COUPONS')
    ]).then(([status, coupons]) => {
      commit('SET_IS_VIP', status.isVip)
      return [status, coupons]
    })
  },
  FETCH_USER_POSITION: ({ commit, dispatch }) => {
    return fetchUserPostion()
      .then(({ lat, lng }) => {
        commit('SET_USER_LATITUDE', lat)
        commit('SET_USER_LONGITUDE', lng)
      })
      .catch(err => {
        vAlert({ content: err.message })
      })
  },

  FETCH_DELIVERY_FEE: ({ commit, dispatch, rootState, state }) => {
    const { tenantLatitude, tenantLongitude } = rootState.tenant

    ;(state.userLatitude && state.userLongitude
      ? Promise.resolve()
      : dispatch('FETCH_USER_POSITION')).then(() => {
      computeDistanceBetween(
        { lat: state.userLatitude, lng: state.userLongitude },
        { lat: tenantLatitude, lng: tenantLongitude }
      )
        .then(({ userLatitude, userLongitude, distance }) => {
          commit('SET_DELIVERY_DISTANCE', distance)

          Logger.info({
            module: 'user',
            method: 'FETCH_DELIVERY_FEE',
            description: `userLatitude: ${userLatitude}, userLongitude: ${userLongitude}, distance: ${distance} 米`
          })

          UserService.getDeliveryFee(distance)
            .then(
              ({
                deliveryFeeId,
                deliveryFeeValue,
                deliveryTime,
                startPrice
              }) => {
                commit('SET_DELIVERY_FEE_ID', deliveryFeeId)
                commit('SET_DELIVERY_FEE_VALUE', deliveryFeeValue)
                commit('SET_DELIVERY_TIME', deliveryTime)
                commit('SET_START_PRICE', startPrice)
                return { deliveryFeeId, deliveryFeeValue, deliveryTime }
              }
            )
            .then(({ deliveryFeeId, deliveryFeeValue, deliveryTime }) => {
              Logger.info({
                module: 'user',
                method: 'FETCH_DELIVERY_FEE',
                description: `userLatitude: ${state.userLatitude}, userLongitude: ${state.userLongitude}, deliveryFeeValue: ${deliveryFeeValue}, deliveryTime: ${deliveryTime}`
              })
            })
            .catch(_ => {
              commit('SET_DISTANCE_TOO_FAR', true)
              vAlert({ content: '距离过远, 不支持配送 -_-' })
            })
        })
        .catch(err => {
          vAlert({ content: err.message })
        })
    })
  }
}

const getters = {
  isVip(state) {
    return state.isVip
  },
  deliveryFeeId(state) {
    return state.deliveryFeeId
  },
  deliveryFeeValue(state) {
    return state.deliveryFeeValue
  },
  deliveryTime(state) {
    return state.deliveryTime
  },
  deliveryDistance(state) {
    return state.deliveryDistance
  },
  startPrice(state) {
    return state.startPrice
  },
  distanceTooFar(state) {
    return state.distanceTooFar
  },
  tabIndex(state) {
    return state.tabIndex
  },
  userLatitude(state) {
    return state.userLatitude
  },
  userLongitude(state) {
    return state.userLongitude
  }
}

export { state, mutations, actions, getters }
