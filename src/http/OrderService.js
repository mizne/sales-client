import { DEAL, ESHOP, GROUP_SHOPPING, MULTI_ESHOP } from '@/util/constants'
import { BaseService } from './BaseService'
import QRCodeInfo from '@/models/QRCodeInfo'
import { generateBetweenDate } from '@/util/index'

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

  getAllOrder(dateFormat) {
    const [startTime, endTime] = generateBetweenDate(dateFormat)
    const query = `?consigneeId=${QRCodeInfo.getConsigneeId()}&phoneNumber=${QRCodeInfo.getPhoneNumber()}&startTime=${startTime}&endTime=${endTime}`
    return this.getBizTypeHttp()
    .get(`/consignee/order${query}`)
    .then(orders => {
      orders.sort((a, b) => {
        const aMilliseconds = new Date(a.time).getTime()
        const bMilliseconds = new Date(b.time).getTime()
        return bMilliseconds - aMilliseconds
      })
      return orders
    })
    .catch(this.exceptionHandler('OrderService', 'getAllOrder'))
  }

  _addParams(params) {
    const map = {
      [DEAL]: ['tenantId', 'tableName', 'phoneNumber'],
      [ESHOP]: ['tenantId', 'consigneeId', 'tableName', 'phoneNumber', 'qrcodeId'],
      [GROUP_SHOPPING]: ['tenantId', 'consigneeId', 'tableName', 'phoneNumber', 'qrcodeId'],
      [MULTI_ESHOP]: ['tenantId', 'consigneeId', 'tableName', 'phoneNumber', 'qrcodeId']
    }
    this.addBizTypeParams(params, map)
  }

  _getQuery(tradeNo) {
    const map = {
      [DEAL]: ['tenantId', 'tableName'],
      [ESHOP]: ['tenantId', 'consigneeId', 'tableName', 'phoneNumber'],
      [GROUP_SHOPPING]: ['tenantId', 'consigneeId', 'tableName', 'phoneNumber'],
      [MULTI_ESHOP]: ['tenantId', 'consigneeId', 'tableName', 'phoneNumber']
    }

    return this.getBizTypeQuery(map)
  }
}

export default new OrderService()
