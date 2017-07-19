import { UserService } from '@/http/index'
import { vAlert } from '@/util/vux-wrapper'

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
  FETCH_DELIVERY_FEE: ({ commit }) => {
    const merchantAddress = new qq.maps.LatLng(32.03886, 118.79828)

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

          window.alert(`distance: ${distance}`)
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
  }
}

export { state, mutations, actions, getters }
