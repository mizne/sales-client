import { UserService } from '@/http/index'
import { vAlert } from '@/util/vux-wrapper'
import { ESHOP } from '@/util/constants'
import storage from '@/util/storage'

const state = {
  isVip: false,
  deliveryFee: 0
}

const mutations = {
  SET_IS_VIP(state, isVip) {
    state.isVip = isVip
  },
  SET_DELIVERY_FEE(state, fee) {
    state.deliveryFee = fee
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
    // 代售才获取 配送费
    if (storage.get('bizType') === ESHOP) {
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

            UserService.getDeliveryFee(Math.round(distance))
            .then(deliveryFee => {
              commit('SET_DELIVERY_FEE', deliveryFee)
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
  deliveryFee(state) {
    return state.deliveryFee
  }
}

export { state, mutations, actions, getters }
