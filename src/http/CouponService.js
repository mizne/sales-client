import { getBizTypeHttp, exceptionHandler } from './interceptors'
import * as Logger from './Logger'

import router from '@/router/index'
import { vConfirm, vToast } from '@/util/vux-wrapper'
import storage from '@/util/storage'

import Coupon from '@/models/Coupon'
import { DEAL, ESHOP } from '@/util/constants'

class CouponService {
  // 检查当前号码 是否再可领取
  checkPhone(phoneNumber) {
    return getBizTypeHttp()
      .get(`/coupon?phoneNumber=${phoneNumber}&tenantId=${storage.get('tenantId')}`)
      .catch(exceptionHandler('CouponService', 'checkPhone'))
  }

  getAvaliableCoupons() {
    if (storage.has('phoneNumber')) {
      const keys =
        storage.get('bizType') === DEAL
          ? ['tenantId', 'phoneNumber']
          : ['tenantId', 'consigneeId', 'phoneNumber']

      const query =
        `?` + keys.map(key => `${key}=${storage.get(key)}`).join('&')

      return getBizTypeHttp()
        .get(`/availableCoupon${query}`)
        .catch(exceptionHandler('CouponService', 'getAvaliableCoupons'))
    } else {
      return Promise.resolve([])
    }
  }

  // 领取优惠券
  bindCoupon() {
    const tenantId = storage.get('tenantId')
    const consigneeId = storage.get('consigneeId')
    const couponRate = storage.get('couponRate')
    const phoneNumber = storage.get('phoneNumber')
    const coupons = storage.get('coupons')

    const params = {
      tenantId,
      consigneeId,
      couponRate,
      phoneNumber,
      coupons
    }

    return getBizTypeHttp()
      .post('/coupon', params)
      .then(_ => {
        Logger.info({
          module: 'CouponService',
          method: 'bindCoupon',
          description: `领取优惠券, consigneeId: ${consigneeId}, couponRate: ${couponRate}, coupons: ${JSON.stringify(coupons)}`
        })
      })
      .catch(exceptionHandler('CouponService', 'bindCoupon'))
  }

  // 使用优惠券
  consumCoupon(couponKey, tradeNo) {
    const bizType = storage.get('bizType')

    const params = {
      tenantId: storage.get('tenantId'),
      phoneNumber: storage.get('phoneNumber'),
      couponKey,
      tradeNo
    }

    if (bizType === ESHOP) {
      Object.assign(params, {
        consigneeId: storage.get('consigneeId')
      })
    }

    return getBizTypeHttp()
    .post('/couponBindTradeNo', params)
    .catch(exceptionHandler('CouponService', 'consumCoupon'))
  }
}

export default new CouponService()
