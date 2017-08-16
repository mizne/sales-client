import { generateMutations, generateGetters } from '@/store/helper.js'
import { TenantService } from '@/http/index'
import { dateBetween } from '@/util/index'
import QRCodeInfo from '@/models/QRCodeInfo'

const mutationMaps = [
  {
    mutationKey: 'SET_TENANT_NAME',
    stateKey: 'tenantName', // 租户名称
    initValue: ''
  },
  {
    mutationKey: 'SET_VIP_AMOUNT',
    stateKey: 'vipAmount', // 消费满多少成会员 额度
    initValue: 0
  },
  {
    mutationKey: 'SET_ALMOST_VIP_AMOUNT',
    stateKey: 'almostVipAmount', // 消费快满多少 提示还差多少即可成会员
    initValue: 0
  },
  {
    mutationKey: 'SET_HOME_IMAGE',
    stateKey: 'homeImage', // Home.vue 背景图
    initValue: ''
  },
  {
    mutationKey: 'SET_VIP_TOAST',
    stateKey: 'needVipToast', // 是否需要 会员提醒模块
    initValue: true
  },
  {
    mutationKey: 'SET_HAS_CLOSED',
    stateKey: 'hasClosed', // 是否打烊
    initValue: false
  },
  {
    mutationKey: 'SET_NEED_CHOOSE_PEOPLE_NUMBER_PAGE',
    stateKey: 'needChoosePeopleNumberPage',
    initValue: false
  },
  {
    mutationKey: 'SET_TENANT_LONGITUDE',
    stateKey: 'tenantLongitude',
    initValue: ''
  },
  {
    mutationKey: 'SET_TENANT_LATITUDE',
    stateKey: 'tenantLatitude',
    initValue: ''
  },
  {
    mutationKey: 'SET_NEED_DELIVERY_FEE',
    stateKey: 'needDeliveryFee',
    initValue: false
  },
  {
    mutationKey: 'SET_NEED_ORDER_CONFIRM_PAGE',
    stateKey: 'needOrderConfirmPage',
    initValue: false
  },
]

const gettersSeed = [...mutationMaps.map(e => e.stateKey)]

const stateSeed = mutationMaps.reduce((accu, curr) => {
  accu[curr.stateKey] = curr.initValue
  return accu
}, {})

const state = {
  ...stateSeed,
  officialNews: ''
}

const mutations = {
  ...generateMutations(mutationMaps, state),
  SET_OFFICIAL_NEWS(state, news) {
    state.officialNews = news
  }
}

const actions = {
  FETCH_TENANT_CONFIG: ({ commit }) => {
    return TenantService.getConfig().then(config => {
      commit('SET_TENANT_NAME', config.name)
      commit('SET_VIP_AMOUNT', config.vipFee)
      commit('SET_ALMOST_VIP_AMOUNT', config.vipRemindFee)
      commit('SET_HOME_IMAGE', config.homeImage)
      commit('SET_NEED_ORDER_CONFIRM_PAGE', !!config.needOrderConfirmPage)
      commit('SET_OFFICIAL_NEWS', config.officialNews)
      commit('SET_VIP_TOAST', !!config.needVip) 
      commit('SET_NEED_CHOOSE_PEOPLE_NUMBER_PAGE', !!config.needChoosePeopleNumberPage)


      if (config.longitude) {
        commit('SET_TENANT_LONGITUDE', config.longitude)
        commit('SET_TENANT_LATITUDE', config.latitude)
        // 代售、多代售才需配送费
        if (QRCodeInfo.isEShopBizType() || QRCodeInfo.isMultiEShopBizType()) {
          commit('SET_NEED_DELIVERY_FEE', true)
        } else {
          commit('SET_NEED_DELIVERY_FEE', false)
        }
      } else {
        commit('SET_TENANT_LONGITUDE', '')
        commit('SET_TENANT_LATITUDE', '')
        commit('SET_NEED_DELIVERY_FEE', false)
      }

      // 店铺已打烊
      if (!dateBetween(config.startTime, config.endTime)) {
        commit('SET_HAS_CLOSED', true)
      } else {
        commit('SET_HAS_CLOSED', false)
      }

      return config
    })
  }
}

const getters = {
  ...generateGetters(gettersSeed, state),
  officialNews(state) {
    if (Array.isArray(state.officialNews)) {
      return state.officialNews
    }
    return state.officialNews.split('&')
  }
}

export { state, mutations, actions, getters }
