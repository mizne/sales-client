import { getBizTypeHttp, exceptionHandler } from './interceptors'
import storage from '@/util/storage'
import { DEAL, ESHOP } from '@/util/constants'

class WechatService {
  redirect() {
    return getBizTypeHttp()
    .get(`/wechatpay/redirctUrl`)
    .catch(exceptionHandler('WechatService', 'redirect'))
  }

  getWechatPayParams(code) {
    const query = this._getQuery(code)

    return getBizTypeHttp()
    .get(`/wechatpay/wap${query}`)
    .catch(exceptionHandler('WechatService', 'getWechatPayParams'))
  }

  _getQuery(code) {
    const keys =
      storage.get('bizType') === DEAL
        ? ['tenantId', 'tableName']
        : ['tenantId', 'consigneeId', 'tableName', 'phoneNumber']

    const query =
      `?code=${code}&` +
      keys.map(key => `${key}=${storage.get(key)}`)
      .join('&')

    return query
  }
}

export default new WechatService()