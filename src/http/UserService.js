import { getBizTypeHttp, exceptionHandler } from './interceptors'
import storage from '@/util/storage'
import { DEAL, ESHOP } from '@/util/constants'

class UserService {
  getStatus() {
    const bizType = storage.get('bizType')

    if (bizType === DEAL) {
      return this._getStatusForDeal()
    } else if (bizType === ESHOP) {
      return this._getStatusForEShop()
    } else {
      console.error(`Unknown biz type: ${bizType}`)
      return Promise.reject(`Unknown biz type: ${bizType}`)
    }
  }

  getDeliveryFee(distance) {
    return getBizTypeHttp()
    .get(`/deliveryFee?distance=${distance}&tenantId=${storage.get('tenantId')}`)
    .catch(exceptionHandler('UserService', 'getDeliveryFee'))
  }

  _getStatusForDeal() {
    let query =
      `?` +
      ['tenantId', 'tableName']
        .map(key => `${key}=${storage.get(key)}`)
        .join('&')

    query += storage.get('phoneNumber')
      ? `&phoneNumber=${storage.get('phoneNumber')}`
      : ''

    return getBizTypeHttp()
      .get(`/table${query}`)
      .catch(exceptionHandler('UserService', 'getStatus'))
  }

  _getStatusForEShop() {
    if (storage.has('phoneNumber')) {
      let query =
        `?` +
        ['tenantId', 'tableName', 'consigneeId']
          .map(key => (storage.has(key) ? `${key}=${storage.get(key)}` : ''))
          .filter(e => e)
          .join('&')

      query += `&phoneNumber=${storage.get('phoneNumber')}`

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
