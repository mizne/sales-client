import { DEAL, ESHOP, GROUP_SHOPPING, MULTI_ESHOP } from '@/util/constants'
import { BaseService } from './BaseService'

class SMSService extends BaseService {
  getCode(phoneNumber) {
    let query = this._getQuery()

    query += `&phoneNumber=${phoneNumber}`

    return this.getBizTypeHttp()
      .get(`/smscode${query}`)
      .catch(this.exceptionHandler('SMSService', 'getCode'))
  }

  verifyCode(params) {
    this._addPramas(params)

    return this.getBizTypeHttp()
      .post(`/smscode`, params)
      .catch(this.exceptionHandler('SMSService', 'verifyCode'))
  }

  _getQuery() {
    const map = {
      [DEAL]: ['tenantId'],
      [ESHOP]: ['tenantId', 'consigneeId'],
      [GROUP_SHOPPING]: ['tenantId', 'consigneeId'],
      [MULTI_ESHOP]: ['tenantId', 'consigneeId']
    }
    return this.getBizTypeQuery(map)
  }

  _addPramas(params) {
    const map = {
      [DEAL]: ['tenantId'],
      [ESHOP]: ['tenantId', 'consigneeId'],
      [GROUP_SHOPPING]: ['tenantId', 'consigneeId'],
      [MULTI_ESHOP]: ['tenantId', 'consigneeId']
    }

    this.addBizTypeParams(params, map)
  }
}

export default new SMSService()
