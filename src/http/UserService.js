import { getBizTypeHttp, exceptionHandler } from './interceptors'
import QRCodeInfo, { capital } from '@/models/QRCodeInfo'

class UserService {
  getStatus() {
    if (QRCodeInfo.isDealBizType()) {
      return this._getStatusForDeal()
    } else if (QRCodeInfo.isEShopBizType() || QRCodeInfo.isGroupShoppingBizType()) {
      return this._getStatusForEShop()
    } else {
      console.error(`Unknown biz type: ${QRCodeInfo.getBizType()}`)
      return Promise.reject(`Unknown biz type: ${QRCodeInfo.getBizType()}`)
    }
  }

  getDeliveryFee(distance) {
    return getBizTypeHttp()
    .get(`/deliveryFee?distance=${distance}&tenantId=${QRCodeInfo.getTenantId()}`)
    .catch(exceptionHandler('UserService', 'getDeliveryFee'))
  }

  _getStatusForDeal() {
    let query =
      `?` +
      ['tenantId', 'tableName']
        .map(key => `${key}=${QRCodeInfo['get' + capital(key)]()}`)
        .join('&')

    query += QRCodeInfo.hasPhoneNumber()
      ? `&phoneNumber=${QRCodeInfo.getPhoneNumber()}`
      : ''

    return getBizTypeHttp()
      .get(`/table${query}`)
      .catch(exceptionHandler('UserService', 'getStatus'))
  }

  _getStatusForEShop() {
    if (QRCodeInfo.hasPhoneNumber()) {
      let query =
        `?` +
        ['tenantId', 'tableName', 'consigneeId', 'phoneNumber']
          .map(key => `${key}=${QRCodeInfo['get' + capital(key)]()}`)
          .join('&')

      return getBizTypeHttp()
        .get(`/table${query}`)
        .catch(exceptionHandler('UserService', 'getStatus'))
    } else {
      return Promise.resolve({
        isVip: false,
        tableStatus: 0
      })
    }
  }
}

export default new UserService()
