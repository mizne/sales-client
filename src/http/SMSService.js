import { getBizTypeHttp, exceptionHandler } from './interceptors'
import QRCodeInfo, { capital } from '@/models/QRCodeInfo'

class SMSService {
  getCode(phoneNumber) {
    let query = this._getQuery()

    query += `&phoneNumber=${phoneNumber}`

    return getBizTypeHttp()
      .get(`/smscode${query}`)
      .catch(exceptionHandler('SMSService', 'getCode'))
  }

  verifyCode(params) {
    this._addPramas(params)

    return getBizTypeHttp()
      .post(`/smscode`, params)
      .catch(exceptionHandler('SMSService', 'verifyCode'))
  }

  _getQuery() {
    const keys =
      QRCodeInfo.isDealBizType()
        ? ['tenantId']
        : ['tenantId', 'consigneeId']

    const query = `?` + keys.map(key => `${key}=${QRCodeInfo['get' + capital(key)]()}`).join('&')

    return query
  }

  _addPramas(params) {
    if (QRCodeInfo.isDealBizType()) {
      Object.assign(params, {
        tenantId: QRCodeInfo.getTenantId()
      })
    } else if (QRCodeInfo.isEShopBizType()) {
      Object.assign(params, {
        tenantId: QRCodeInfo.getTenantId(),
        consigneeId: QRCodeInfo.getConsigneeId()
      })
    } else {
      console.error(`Unknown biz type: ${QRCodeInfo.getBizType()}`)
    }
  }
}

export default new SMSService()
