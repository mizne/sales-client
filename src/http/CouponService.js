import Logger from '../util/error-logger'
import QRCodeInfo from '@/models/QRCodeInfo'
import { DEAL, ESHOP, GROUP_SHOPPING, MULTI_ESHOP } from '@/util/constants'
import { BaseService } from './BaseService'

class CouponService extends BaseService {
  // 检查当前号码 是否再可领取
  checkPhone(phoneNumber) {
    return this.getBizTypeHttp()
      .get(
        `/coupon?phoneNumber=${phoneNumber}&tenantId=${QRCodeInfo.getTenantId()}`
      )
      .catch(this.exceptionHandler('CouponService', 'checkPhone'))
  }

  getAvaliableCoupons() {
    if (QRCodeInfo.hasPhoneNumber()) {
      const map = {
        [DEAL]: ['tenantId', 'phoneNumber'],
        [ESHOP]: ['tenantId', 'phoneNumber'],
        [GROUP_SHOPPING]: ['tenantId', 'phoneNumber'],
        [MULTI_ESHOP]: ['tenantId', 'phoneNumber']
      }
      const query = this.getBizTypeQuery(map)

      return this.getBizTypeHttp()
        .get(`/availableCoupon${query}`)
        .catch(this.exceptionHandler('CouponService', 'getAvaliableCoupons'))
    } else {
      return Promise.resolve([])
    }
  }

  getAllCoupons() {
    if (QRCodeInfo.hasPhoneNumber()) {
      const map = {
        [DEAL]: ['tenantId', 'phoneNumber'],
        [ESHOP]: ['tenantId', 'phoneNumber'],
        [GROUP_SHOPPING]: ['tenantId', 'phoneNumber'],
        [MULTI_ESHOP]: ['phoneNumber']
      }
      const query = this.getBizTypeQuery(map)

      return this.getBizTypeHttp()
      .get(`/availableCoupon${query}`)
      .catch(this.exceptionHandler('CouponService', 'getAllCoupons'))
    } else {
      return Promise.resolve([])
    }
  }

  // 领取优惠券(只有代售或群购业务才有)
  bindCoupon() {
    const map = {
      [ESHOP]: [
        'tenantId',
        'phoneNumber',
        'consigneeId',
        'couponRate',
        'coupons'
      ],
      [GROUP_SHOPPING]: [
        'tenantId',
        'phoneNumber',
        'consigneeId',
        'couponRate',
        'coupons'
      ]
    }
    const params = {}
    this.addBizTypeParams(params, map)

    return this.getBizTypeHttp()
      .post('/coupon', params)
      .then(_ => {
        Logger.info({
          module: 'CouponService',
          method: 'bindCoupon',
          description: `领取优惠券, consigneeId: ${QRCodeInfo.getConsigneeId()}, couponRate: ${QRCodeInfo.getCouponRate()}, coupons: ${JSON.stringify(
            QRCodeInfo.getCoupons()
          )}`
        })
      })
      .catch(this.exceptionHandler('CouponService', 'bindCoupon'))
  }

  // 使用优惠券
  consumCoupon(couponKey, tradeNo) {
    const map = {
      [DEAL]: ['tenantId', 'phoneNumber'],
      [ESHOP]: ['tenantId', 'phoneNumber', 'consigneeId'],
      [GROUP_SHOPPING]: ['tenantId', 'phoneNumber', 'consigneeId'],
      [MULTI_ESHOP]: ['tenantId', 'phoneNumber', 'consigneeId']
    }
    const params = { couponKey, tradeNo }
    this.addBizTypeParams(params, map)

    return this.getBizTypeHttp()
      .post('/couponBindTradeNo', params)
      .catch(this.exceptionHandler('CouponService', 'consumCoupon'))
  }

  //  删除某个优惠券
  delCoupon(couponKey) {
    const map = {
      [DEAL]: ['tenantId', 'phoneNumber'],
      [ESHOP]: ['tenantId', 'phoneNumber', 'consigneeId'],
      [GROUP_SHOPPING]: ['tenantId', 'phoneNumber', 'consigneeId'],
      [MULTI_ESHOP]: ['phoneNumber', 'consigneeId']
    }
    const query = this.getBizTypeQuery(map)

    return this.getBizTypeHttp()
    .delete(`/coupon${query}&couponKey=${couponKey}`)
    .catch(this.exceptionHandler('CouponService', 'consumCoupon'))
  }
}

export default new CouponService()
