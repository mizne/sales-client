import { getBizTypeHttp, exceptionHandler } from './interceptors'
import storage from '@/util/storage'
import { DEAL, ESHOP } from '@/util/constants'

class OrderService {
  addOrder(params) {
    this._addParams(params)

    return getBizTypeHttp()
      .post('/order', params)
      .catch(exceptionHandler('OrderService', 'addOrder'))
  }

  getOrder(tradeNo) {
    const query = this._getQuery(tradeNo)

    return getBizTypeHttp()
      .get(`/order${query}`)
      .catch(exceptionHandler('OrderService', 'getOrder'))
  }

  editOrder(params) {
    return getBizTypeHttp()
      .put('/order', params)
      .catch(exceptionHandler('OrderService', 'editOrder'))
  }

  delOrder(tradeNo) {
    const query =
      '?' +
      ['tenantId', 'consigneeId', 'tableName', 'phoneNumber']
        .map(key => (storage.has(key) ? `${key}=${storage.get(key)}` : ''))
        .join('&')
    return getBizTypeHttp()
      .delete(`/order${query}`)
      .catch(exceptionHandler('OrderService', 'delOrder'))
  }

  _addParams(params) {
    const bizType = storage.get('bizType')
    if (bizType === DEAL) {
      Object.assign(params, {
        tenantId: storage.get('tenantId'),
        tableName: storage.get('tableName'),
        phoneNumber: storage.get('phoneNumber')
      })
    } else if (bizType === ESHOP) {
      Object.assign(params, {
        tenantId: storage.get('tenantId'),
        consigneeId: storage.get('consigneeId'),
        tableName: storage.get('tableName'),
        phoneNumber: storage.get('phoneNumber')
      })
    } else {
      console.error(`Unknown biz type: ${bizType}`)
    }
  }

  _getQuery(tradeNo) {
    const keys =
      storage.get('bizType') === DEAL
        ? ['tenantId', 'tableName']
        : ['tenantId', 'consigneeId', 'tableName', 'phoneNumber']

    let query = `?` + keys.map(key => `${key}=${storage.get(key)}`).join('&')

    // 获取未支付订单 没有tradeNo, 获取支付后订单 有tradeNo
    query += tradeNo ? `&tradeNo=${tradeNo}` : ''

    return query
  }
}

export default new OrderService()
