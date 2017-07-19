import { getBizTypeHttp, exceptionHandler } from './interceptors'
import storage from '@/util/storage'
import { DEAL, ESHOP } from '@/util/constants'

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
      storage.get('bizType') === DEAL
        ? ['tenantId']
        : ['tenantId', 'consigneeId']

    const query = `?` + keys.map(key => `${key}=${storage.get(key)}`).join('&')

    return query
  }

  _addPramas(params) {
    const bizType = storage.get('bizType')

    if (bizType === DEAL) {
      Object.assign(params, {
        tenantId: storage.get('tenantId')
      })
    } else if (bizType === ESHOP) {
      Object.assign(params, {
        tenantId: storage.get('tenantId'),
        consigneeId: storage.get('consigneeId')
      })
    } else {
      console.error(`Unknown biz type: ${bizType}`)
    }
  }
}

export default new SMSService()
