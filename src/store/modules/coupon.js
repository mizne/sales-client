import { CouponService } from '@/http/index'
import { not } from '@/util/index'
import Coupon from '@/models/Coupon'
import { vConfirm, vToast } from '@/util/vux-wrapper'
import router from '@/router/index'
import { RECEIVE_COUPON } from '@/store/modules/phoneVerify'
import QRCodeInfo from '@/models/QRCodeInfo'

const state = {
  allCoupons: [],
  avaliableCoupons: [],
  disableCoupons: [],
  couponText: '',
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
  SET_COUPON_TEXT(state, couponText) {
    state.couponText = couponText
  },
  SET_SELECTED_COUPON(state, coupon) {
    state.selectedCoupon = coupon
  }
}

const actions = {
  // 领取优惠券
  RECEIVE_COUPON: ({ commit }) => {
    const coupons = QRCodeInfo.getCoupons().map(e => new Coupon(e.couponType, e.couponValue))

    const text = `<p>是否领取 ${coupons.length} 张优惠券?</p>` + coupons.map(e => `<p>${e.getText()}</p>`).join(``)

    if (QRCodeInfo.hasPhoneNumber()) {
      return vConfirm({ content: text }).then(
        () => {
          return CouponService.checkPhone(QRCodeInfo.getPhoneNumber())
            .then(_ => CouponService.bindCoupon())
            .then(() => {
              vToast({ content: '恭喜, 领取成功 ^_^' })
            })
            .catch(() => {
              vToast({ content: '啊哦, 领取失败 -_-' })
            })
        },
        () => {
          vToast({ content: '取消领取 ^_^' })
        }
      )
    } else {
      return vConfirm({ content: text }).then(
        () => {
          commit('SET_PURPOSE_OF_PHONE_VERIFY', RECEIVE_COUPON)
          router.push({ name: 'PhoneVerify' })
        },
        () => {
          vToast({ content: '取消领取优惠券 ^_^' })
        }
      )
    }
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

      // 初始扫描二维码进来 需要请求可用优惠券 此时没有订单
      // 获取订单时 再请求可用优惠券(过滤掉 满减券 价格不够的)
      const predicate = rootState.order.orderDetail
      ? (e => {
        if (e.couponType === 'reduce') {
          let orderPrice = rootState.order.orderDetail.totalPrice
          // 如果有配送费 则加上
          if (rootState.user.deliveryFeeValue) {
            orderPrice += rootState.user.deliveryFeeValue
          }
          const couponValue = Number(e.value.split('-')[0])
          return orderPrice >= couponValue
        } else {
          return true
        }
      })
      : () => true
      
      const avaliableCoupons = coupons.filter(predicate)
      const disableCoupons = coupons.filter(not(predicate))

      commit('SET_ALL_COUPONS', coupons)
      commit('SET_AVALIABLE_COUPONS', avaliableCoupons)
      commit('SET_DISABLE_COUPONS', disableCoupons)
      const couponText =
        avaliableCoupons.length > 0 ? `${avaliableCoupons.length} 张可用` : '无可用'
      commit('SET_COUPON_TEXT', couponText)

      return coupons
    })
  },
  // 选中优惠券
  SELECT_COUPON: ({ commit, state }, coupon) => {
    commit('SET_SELECTED_COUPON', coupon)
    if (coupon) {
      const couponText = new Coupon(coupon.couponType, coupon.value).getText()

      commit('SET_COUPON_TEXT', couponText)
    } else {
      const couponText =
        state.avaliableCoupons.length > 0
          ? `${state.avaliableCoupons.length} 张可用`
          : '无可用'
      commit('SET_COUPON_TEXT', couponText)
    }
  },
  // 使用优惠券
  COUSUM_COUPON: ({ commit, state, rootState }) => {
    // 将选中的优惠券 和 订单号绑定
    return CouponService.consumCoupon(
      state.selectedCoupon.couponKey,
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
  couponText(state) {
    return state.couponText
  },
  selectedCoupon(state) {
    return state.selectedCoupon
  }
}

export { state, mutations, actions, getters }
