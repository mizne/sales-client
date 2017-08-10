import { UserService, Logger } from '@/http/index'
import { vAlert } from '@/util/vux-wrapper'
import QRCodeInfo from '@/models/QRCodeInfo'

const state = {
  isVip: false, // 是否vip
  deliveryFeeId: '', // 配送id
  deliveryFeeValue: '', // 配送费
  deliveryTime: '', // 配送所需时间
  deliveryDistance: 0, // 配送距离
  startPrice: '', // 起送价格
  distanceTooFar: false,
  tabIndex: 0
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
  FETCH_DELIVERY_FEE: ({ commit, rootState }) => {
    const { tenantLatitude, tenantLongitude } = rootState.tenant
    const merchantAddress = new qq.maps.LatLng(tenantLatitude, tenantLongitude)

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        //调用地图命名空间中的转换接口   type的可选值为 1:GPS经纬度，2:搜狗经纬度，3:百度经纬度，4:mapbar经纬度，5:google经纬度，6:搜狗墨卡托
        qq.maps.convertor.translate(new qq.maps.LatLng(lat, lng), 1, function(
          res
        ) {
          const { lat: userLatitude, lng: userLongitude } = res[0]
          const userAddress = new qq.maps.LatLng(userLatitude, userLongitude)
          const distance = Math.round(
            qq.maps.geometry.spherical.computeDistanceBetween(
              userAddress,
              merchantAddress
            )
          )
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
                description: `userLatitude: ${userLatitude}, userLongitude: ${userLongitude}, deliveryFeeValue: ${deliveryFeeValue}, deliveryTime: ${deliveryTime}`
              })
            })
            .catch(_ => {
              commit('SET_DISTANCE_TOO_FAR', true)
              vAlert({ content: '距离过远, 不支持配送 -_-' })
            })
        })
      })
    } else {
      vAlert({ content: '您的浏览器不支持获取地理位置功能' })
    }
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
  }
}

export { state, mutations, actions, getters }
