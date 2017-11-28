import { AlipayService, WechatService, OfflinePayService } from '@/http/index'
import router from '@/router/index'
import QRCodeInfo from '@/models/QRCodeInfo'

// 阿里支付 URL前缀
export const ALIPAY_PREFIX_URL = 'https://openapi.alipay.com/gateway.do?'

const state = {
  alipayUrl: '',
  showIframe: false,
  offlinePayResult: false
}

const mutations = {
  SET_ALIPAY_URL(state, url) {
    state.alipayUrl = url
  },
  SET_SHOW_IFRAME(state, showIframe) {
    state.showIframe = showIframe
  },
  SET_OFFLINE_PAY_RESULT(state, result) {
    state.offlinePayResult = result
  }
}

const actions = {
  OFFLINE_PAY: ({ commit }, { tradeNo }) => {
    return OfflinePayService.payOffline(tradeNo)
    .then(() => {
      commit('SET_OFFLINE_PAY_RESULT', true)
      router.push({ name: 'OfflinePayResult' })
    })
    .catch(() => {
      commit('SET_OFFLINE_PAY_RESULT', false)
      router.push({ name: 'OfflinePayResult' })
    })
  },

  FETCH_ALIPAY_URL: ({ commit, rootState }) => {
    router.push({ name: 'Alipay' })
    const tenantId = QRCodeInfo.getTenantId()

    return AlipayService.getWapParams(rootState.order.orderDetail[tenantId].tradeNo)
      .then(urlParams => {
        commit('SET_SHOW_IFRAME', true)
        const url = `${ALIPAY_PREFIX_URL}${urlParams}`
        commit('SET_ALIPAY_URL', url)
      })
  },

  FETCH_WECHATPAY_URL: ({ commit }) => {
    return WechatService.redirectForPay().then(url => {
      window.location.href = url
    })
  },

  FETCH_WECHATPAY_URL_EPAY: ({ commit }) => {
    return WechatService.redirectForEPay().then(url => {
      window.location.href = url
    })
  },

  Online_WECHATPAY_URL_EPAY: ({ commit }) => {
    return WechatService.OnlineRedirectForEPay().then(url => {
      window.location.href = url
    })
  },

  FETCH_WECHATPAY_URL_IPAY: ({ commit }) => {
    return WechatService.RedirectForIPay().then(url => {
      window.location.href = url
    })
  },

  FETCH_WECHATPAY_PARAMS: ({ commit }, code) => {
    return WechatService.getWechatPayParams(code)
  },

  FETCH_WECHATPAY_PARAMS_EPAY: ({ commit }, {code, amount, onlineTradeNo}) => {
    return WechatService.getWechatPayParamsForEPay(code, amount, onlineTradeNo)
  },

  Online_WECHATPAY_PARAMS_EPAY: ({ commit }, {code, amount}) => {
    return WechatService.OnlineWechatPayParamsForEPay(code, amount)
  },

  FETCH_WECHATPAY_PARAMS_IPAY: ({ commit }, {code, amount}) => {
    return WechatService.getWechatPayParamsForIPay(code, amount)
  },

  FETCH_ALIPAY_EPAY: ({ commit }, amount) => {
    router.push({ name: 'Alipay' })
    const qrcodeId = QRCodeInfo.getQrcodeId()

    return AlipayService.getEPayParams(qrcodeId, amount)
    .then(urlParams => {
      commit('SET_SHOW_IFRAME', true)
      const url = `${ALIPAY_PREFIX_URL}${urlParams}`
      commit('SET_ALIPAY_URL', url)
    })
  },

  Online_ALIPAY_EPAY: ({ commit }, amount) => {
    router.push({ name: 'Alipay' })
    let qrcodeId = '201710111357459483951';

    return AlipayService.getOnlineParams(qrcodeId, amount)
      .then(urlParams => {
        commit('SET_SHOW_IFRAME', true)
        const url = `${ALIPAY_PREFIX_URL}${urlParams}`
        commit('SET_ALIPAY_URL', url)
      })
  },

  FETCH_ALIPAY_IPAY: ({ commit }, amount) => {
    router.push({ name: 'Alipay' })
    const qrcodeId = QRCodeInfo.getQrcodeId()

    return AlipayService.getIPayParams(qrcodeId, amount)
      .then(urlParams => {
        commit('SET_SHOW_IFRAME', true)
        const url = `${ALIPAY_PREFIX_URL}${urlParams}`
        commit('SET_ALIPAY_URL', url)
      })
  }

}





const getters = {
  alipayUrl(state) {
    return state.alipayUrl
  },
  showIframe(state) {
    return state.showIframe
  },
  offlinePayResult(state) {
    return state.offlinePayResult
  }
}

export { state, mutations, actions, getters }
