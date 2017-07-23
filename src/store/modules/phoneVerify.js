import { SMSService } from '@/http/index'
import router from '@/router/index'
import { vToast } from '@/util/vux-wrapper'
import QRCodeInfo from '@/models/QRCodeInfo'

// 验证手机号码目的
export const ADD_SHOPPING_CART = 'ADD_SHOPPING_CART'
export const RECEIVE_COUPON = 'RECEIVE_COUPON'
export const ADD_ORDER = 'ADD_ORDER'

const state = {
  purposeOfPhoneVerify: ''
}

const mutations = {
  SET_PURPOSE_OF_PHONE_VERIFY(state, purpose) {
    state.purposeOfPhoneVerify = purpose
  }
}

const actions = {
  FETCH_SMS_CODE: ({ commit, dispatch }, phoneNumber) => {
    return SMSService.getCode(phoneNumber)
  },
  VERIFY_SMS_CODE: ({ commit, dispatch, rootState }, { phoneNumber, verifyCode }) => {
    commit('SHOW_LOADING', true)
    return SMSService.verifyCode({ phoneNumber, verifyCode }).then(_ => {
      QRCodeInfo.setPhoneNumber(phoneNumber)

      // 代售业务 下购物车时 需要的验证手机号码
      if (state.purposeOfPhoneVerify === ADD_SHOPPING_CART) {
        commit('SHOW_LOADING', false)
        dispatch('ADD_SHOPPING_CART')
        // 领取优惠券时 需要的验证手机号码
      } else if (state.purposeOfPhoneVerify === RECEIVE_COUPON) {
        dispatch('BIND_COUPON')
        .then(_ => {
          router.push({ name: 'Menu' })
        })
        .catch(_ => {
          router.push({ name: 'Menu' })
        })
          // 点餐业务 下订单时 需要的验证手机号码
      } else if (state.purposeOfPhoneVerify === ADD_ORDER) {
        commit('SHOW_LOADING', false)
        if (rootState.tenant.needChoosePeopleNumberPage) {
          router.push({ name: 'PeopleNumber' })
        } else {
          dispatch('ADD_ORDER')
        }
      }
    })
  }
}

const getters = {
  purposeOfPhoneVerify(state) {
    return state.purposeOfPhoneVerify
  }
}

export { state, mutations, actions, getters }

