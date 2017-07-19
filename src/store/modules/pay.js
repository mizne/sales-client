import { AlipayService, WechatService } from '@/http/index'
import storage from '@/util/storage'
import router from '@/router/index'

// 阿里支付 URL前缀
export const ALIPAY_PREFIX_URL = 'https://openapi.alipay.com/gateway.do?'

const state = {
  alipayUrl: '',
  showIframe: false
}

const mutations = {
  SET_ALIPAY_URL(state, url) {
    state.alipayUrl = url
  },
  SET_SHOW_IFRAME(state, showIframe) {
    state.showIframe = showIframe
  }
}

const actions = {
  FETCH_ALIPAY_URL: ({ commit, rootState }) => {
    router.push({ name: 'Alipay' })

    return AlipayService.getWapParams(rootState.order.orderDetail.tradeNo)
      .then(urlParams => {
        commit('SET_SHOW_IFRAME', true)
        const url = `${ALIPAY_PREFIX_URL}${urlParams}`
        commit('SET_ALIPAY_URL', url)
      })
  },

  FETCH_WECHATPAY_URL: ({ commit }) => {
    return WechatService.redirect().then(url => {
      window.location.href = url
    })
  },

  FETCH_WECHATPAY_PARAMS: ({ commit }, code) => {
    return WechatService.getWechatPayParams(code)
  }
}

const getters = {
  alipayUrl(state) {
    return state.alipayUrl
  },
  showIframe(state) {
    return state.showIframe
  }
}

export { state, mutations, actions, getters }
