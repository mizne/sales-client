import { getBizTypeHttp, exceptionHandler } from './interceptors'
import QRCodeInfo, { capital } from '@/models/QRCodeInfo'

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
    const keys =
      QRCodeInfo.isDealBizType()
        ? ['tenantId', 'tableName', 'phoneNumber']
        : ['tenantId', 'consigneeId', 'tableName', 'phoneNumber']

    const query =
      `?` +
      keys.map(key => `${key}=${QRCodeInfo['get' + capital(key)]()}`).join('&')

    return getBizTypeHttp()
      .delete(`/order${query}`)
      .catch(exceptionHandler('OrderService', 'delOrder'))
  }

  _addParams(params) {
    if (QRCodeInfo.isDealBizType()) {
      Object.assign(params, {
        tenantId: QRCodeInfo.getTenantId(),
        tableName: QRCodeInfo.getTableName(),
        phoneNumber: QRCodeInfo.getPhoneNumber()
      })
    } else if (QRCodeInfo.isEShopBizType() || QRCodeInfo.isGroupShoppingBizType()) {
      Object.assign(params, {
        tenantId: QRCodeInfo.getTenantId(),
        consigneeId: QRCodeInfo.getConsigneeId(),
        tableName: QRCodeInfo.getTableName(),
        phoneNumber: QRCodeInfo.getPhoneNumber()
      })
    } else {
      console.error(`Unknown biz type: ${QRCodeInfo.getBizType()}`)
    }
  }

  _getQuery(tradeNo) {
    const keys =
      QRCodeInfo.isDealBizType()
        ? ['tenantId', 'tableName']
        : ['tenantId', 'consigneeId', 'tableName', 'phoneNumber']

    let query = `?` + keys.map(key => `${key}=${QRCodeInfo['get' + capital(key)]()}`).join('&')

    // 获取未支付订单 没有tradeNo, 获取支付后订单 有tradeNo
    query += tradeNo ? `&tradeNo=${tradeNo}` : ''

    return query
  }
}

export default new OrderService()
