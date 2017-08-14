import { DEAL, ESHOP, GROUP_SHOPPING } from '@/util/constants'
import { BaseService } from './BaseService'

class WechatService extends BaseService {
  redirect() {
    return this.getBizTypeHttp()
      .get(`/wechatpay/redirctUrl`)
      .catch(this.exceptionHandler('WechatService', 'redirect'))
  }

  getWechatPayParams(code) {
    let query = this._getQuery()
    query += `&code=${code}`

    return this.getBizTypeHttp()
      .get(`/wechatpay/wap${query}`)
      .catch(this.exceptionHandler('WechatService', 'getWechatPayParams'))
  }

  _getQuery(code) {
    const map = {
      [DEAL]: ['tenantId', 'tableName', 'phoneNumber'],
      [ESHOP]: ['tenantId', 'consigneeId', 'tableName', 'phoneNumber'],
      [GROUP_SHOPPING]: ['tenantId', 'consigneeId', 'tableName', 'phoneNumber']
    }
    return this.getBizTypeQuery(map)
  }
}

export default new WechatService()
