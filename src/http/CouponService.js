import { getBizTypeHttp, exceptionHandler } from './interceptors'
import * as Logger from './Logger'

import router from '@/router/index'
import { vConfirm, vToast } from '@/util/vux-wrapper'
import QRCodeInfo, { capital } from '@/models/QRCodeInfo'

import Coupon from '@/models/Coupon'
import { DEAL, ESHOP } from '@/util/constants'

class CouponService {
  // 检查当前号码 是否再可领取
  checkPhone(phoneNumber) {
    return getBizTypeHttp()
      .get(`/coupon?phoneNumber=${phoneNumber}&tenantId=${QRCodeInfo.getTenantId()}`)
      .catch(exceptionHandler('CouponService', 'checkPhone'))
  }

  getAvaliableCoupons() {
    if (QRCodeInfo.hasPhoneNumber()) {
      const keys =
        QRCodeInfo.isDealBizType()
          ? ['tenantId', 'phoneNumber']
          : ['tenantId', 'consigneeId', 'phoneNumber']

      const query =
        `?` + keys.map(key => `${key}=${QRCodeInfo['get' + capital(key)]()}`).join('&')

      return getBizTypeHttp()
        .get(`/availableCoupon${query}`)
        .catch(exceptionHandler('CouponService', 'getAvaliableCoupons'))
    } else {
      return Promise.resolve([])
    }
  }

  // 领取优惠券
  bindCoupon() {
    const tenantId = QRCodeInfo.getTenantId()
    const consigneeId = QRCodeInfo.getConsigneeId()
    const couponRate = QRCodeInfo.getCouponRate()
    const phoneNumber = QRCodeInfo.getPhoneNumber()
    const coupons = QRCodeInfo.getCoupons()

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
    const params = {
      tenantId: QRCodeInfo.getTenantId(),
      phoneNumber: QRCodeInfo.getPhoneNumber(),
      couponKey,
      tradeNo
    }

    if (QRCodeInfo.isEShopBizType()) {
      Object.assign(params, {
        consigneeId: QRCodeInfo.getConsigneeId()
      })
    }

    return getBizTypeHttp()
    .post('/couponBindTradeNo', params)
    .catch(exceptionHandler('CouponService', 'consumCoupon'))
  }
}

export default new CouponService()
