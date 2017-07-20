import { UserService, Logger } from '@/http/index'
import { vAlert } from '@/util/vux-wrapper'
import QRCodeInfo from '@/models/QRCodeInfo'

const state = {
  isVip: false,
  deliveryFeeId: '',
  deliveryFeeValue: 0,
  deliveryTime: ''
}

const mutations = {
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
  }
}

const actions = {
  FETCH_USER_STATUS: ({ commit }) => {
    return UserService.getStatus().then(status => {
      commit('SET_IS_VIP', status.isVip)
      return status
    })
  },
  FETCH_DELIVERY_FEE: ({ commit, rootState }) => {
    // 代售业务且商户有经纬度才获取 配送费
    if (rootState.tenant.needDeliveryFee) {
      const { tenantLatitude, tenantLongitude } = rootState.tenant
      const merchantAddress = new qq.maps.LatLng(
        tenantLatitude,
        tenantLongitude
      )

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var lat = position.coords.latitude
          var lng = position.coords.longitude
          //调用地图命名空间中的转换接口   type的可选值为 1:GPS经纬度，2:搜狗经纬度，3:百度经纬度，4:mapbar经纬度，5:google经纬度，6:搜狗墨卡托
          qq.maps.convertor.translate(new qq.maps.LatLng(lat, lng), 1, function(
            res
          ) {
            const userAddress = new qq.maps.LatLng(res[0].lat, res[0].lng)
            const distance = qq.maps.geometry.spherical.computeDistanceBetween(
              userAddress,
              merchantAddress
            )

            Logger.info({
              module: 'user',
              method: 'FETCH_DELIVERY_FEE',
              description: `userLatitude: ${res[0].lat}, userLongitude: ${res[0]
                .lng}`
            })

            UserService.getDeliveryFee(Math.round(distance))
              .then(({ deliveryFeeId, deliveryFeeValue, deliveryTime }) => {
                commit('SET_DELIVERY_FEE_ID', deliveryFeeId)
                commit('SET_DELIVERY_FEE_VALUE', deliveryFeeValue)
                commit('SET_DELIVERY_TIME', deliveryTime)
                return { deliveryFeeId, deliveryFeeValue, deliveryTime }
              })
              .then(({ deliveryFeeId, deliveryFeeValue, deliveryTime }) => {
                Logger.info({
                  module: 'user',
                  method: 'FETCH_DELIVERY_FEE',
                  description: `userLatitude: ${res[0]
                    .lat}, userLongitude: ${res[0].lng}, deliveryFeeValue: ${deliveryFeeValue}, deliveryTime: ${deliveryTime}`
                })
              })
          })
        })
      } else {
        vAlert({ content: '您的浏览器不支持获取地理位置功能' })
      }
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
  }
}

export { state, mutations, actions, getters }
