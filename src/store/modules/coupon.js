import { CouponService } from '@/http/index'
import Coupon from '@/models/Coupon'
import { vConfirm, vToast } from '@/util/vux-wrapper'
import { RECEIVE_COUPON } from '@/store/modules/phoneVerify'
import QRCodeInfo from '@/models/QRCodeInfo'
import router from '@/router/index'

const state = {
  allCoupons: [],
  avaliableCoupons: [],
  disableCoupons: [],
  selectedCoupon: null
}

const mutations = {
  SET_ALL_COUPONS(state, coupons) {
    state.allCoupons = coupons
  },
  SET_AVALIABLE_COUPONS(state, coupons) {
    state.avaliableCoupons = coupons
  },
  SET_DISABLE_COUPONS(state, coupons) {
    state.disableCoupons = coupons
  },
  SET_SELECTED_COUPON(state, coupon) {
    state.selectedCoupon = coupon
  }
}

const actions = {
  // 预领取优惠券
  RECEIVE_COUPON: ({ commit, dispatch }) => {
    const coupons = QRCodeInfo.getCoupons().map(
      e => new Coupon(e.couponType, e.couponValue)
    )

    const text =
      `<p>是否领取 ${coupons.length} 张优惠券?</p>` +
      coupons.map(e => `<p>${e.getText()}</p>`).join(``)

    if (QRCodeInfo.hasPhoneNumber()) {
      return vConfirm({ content: text }).then(
        () => {
          return CouponService.checkPhone(QRCodeInfo.getPhoneNumber())
            .then(_ => dispatch('BIND_COUPON'))
            .catch(err => {
              vToast({ content: `啊哦, ${err.message} -_-` })
              dispatch('FETCH_AVALIABLE_COUPONS')
            })
        },
        () => {
          vToast({ type: 'cancel', content: '取消领取 ^_^' })
        }
      )
    } else {
      return vConfirm({ content: text }).then(
        () => {
          commit('SET_PURPOSE_OF_PHONE_VERIFY', RECEIVE_COUPON)
          router.push({ name: 'PhoneVerify' })
        },
        () => {
          vToast({ type: 'cancel', content: '取消领取 ^_^' })
        }
      )
    }
  },
  // 领取优惠券
  BIND_COUPON: ({ commit, dispatch }) => {
    return CouponService.bindCoupon()
      .then(_ => {
        vToast({ type: 'success', content: '恭喜, 领取成功 ^_^' })
        dispatch('FETCH_AVALIABLE_COUPONS')
      })
      .catch(err => {
        vToast({ content: `啊哦, ${err.message || '领取失败'} -_-` })
        dispatch('FETCH_AVALIABLE_COUPONS')
      })
  },
  // 获取可用优惠券
  FETCH_AVALIABLE_COUPONS: ({ commit, rootState }) => {
    return CouponService.getAvaliableCoupons().then(coupons => {
      // 将优惠券 按照失效时间 倒序
      coupons.sort((a, b) => {
        const aMilliseconds = new Date(a.InvalidDate).getTime()
        const bMilliseconds = new Date(b.InvalidDate).getTime()

        return aMilliseconds - bMilliseconds
      })

      commit('SET_ALL_COUPONS', coupons)
      return coupons
    })
  },
  // 选中优惠券
  SELECT_COUPON: ({ commit, state }, coupon) => {
    commit('SET_SELECTED_COUPON', coupon)
  },
  // 使用优惠券
  COUSUM_COUPON: ({ commit, state, rootState }) => {
    // 将选中的优惠券 和 订单号绑定
    return CouponService.consumCoupon(
      state.selectedCoupon? state.selectedCoupon.couponKey : '',
      rootState.order.orderDetail.tradeNo
    )
  }
}

const getters = {
  allCoupons(state) {
    return state.allCoupons
  },
  avaliableCoupons(state) {
    return state.avaliableCoupons
  },
  disableCoupons(state) {
    return state.disableCoupons
  },
  selectedCoupon(state) {
    return state.selectedCoupon
  }
}

export { state, mutations, actions, getters }
