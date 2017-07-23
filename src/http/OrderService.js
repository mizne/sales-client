import { DEAL, ESHOP, GROUP_SHOPPING } from '@/util/constants'
import { BaseService } from './BaseService'

class OrderService extends BaseService {
  addOrder(params) {
    this._addParams(params)

    return this.getBizTypeHttp()
      .post('/order', params)
      .catch(this.exceptionHandler('OrderService', 'addOrder'))
  }

  getOrder(tradeNo) {
    let query = this._getQuery()
    // 获取未支付订单 没有tradeNo, 获取支付后订单 有tradeNo
    query += tradeNo ? `&tradeNo=${tradeNo}` : ''

    return this.getBizTypeHttp()
      .get(`/order${query}`)
      .catch(this.exceptionHandler('OrderService', 'getOrder'))
  }

  editOrder(params) {
    return this.getBizTypeHttp()
      .put('/order', params)
      .catch(this.exceptionHandler('OrderService', 'editOrder'))
  }

  delOrder(tradeNo) {
    const query = this._getQuery()

    return this.getBizTypeHttp()
      .delete(`/order${query}`)
      .catch(this.exceptionHandler('OrderService', 'delOrder'))
  }

  _addParams(params) {
    const map = {
      [DEAL]: ['tenantId', 'tableName', 'phoneNumber'],
      [ESHOP]: ['tenantId', 'consigneeId', 'tableName', 'phoneNumber'],
      [GROUP_SHOPPING]: ['tenantId', 'consigneeId', 'tableName', 'phoneNumber']
    }
    this.addBizTypeParams(params, map)
  }

  _getQuery(tradeNo) {
    const map = {
      [DEAL]: ['tenantId', 'tableName'],
      [ESHOP]: ['tenantId', 'consigneeId', 'tableName', 'phoneNumber'],
      [GROUP_SHOPPING]: ['tenantId', 'consigneeId', 'tableName', 'phoneNumber']
    }

    return this.getBizTypeQuery(map)
  }
}

export default new OrderService()
