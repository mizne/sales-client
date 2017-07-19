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
    var geolocation = new BMap.Geolocation()
    geolocation.getCurrentPosition(
      function(r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          var mk = new BMap.Marker(r.point)
          map.addOverlay(mk)
          map.panTo(r.point)
          alert('您的位置：' + r.point.lng + ',' + r.point.lat)
        } else {
          alert('failed' + this.getStatus())
        }
      },
      { enableHighAccuracy: true }
    )

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        console.log(position.coords.latitude, position.coords.longitude)
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
