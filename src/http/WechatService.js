import { getBizTypeHttp, exceptionHandler } from './interceptors'
import QRCodeInfo, { capital } from '@/models/QRCodeInfo'

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
      QRCodeInfo.isDealBizType()
        ? ['tenantId', 'tableName']
        : ['tenantId', 'consigneeId', 'tableName', 'phoneNumber']

    const query =
      `?code=${code}&` +
      keys.map(key => `${key}=${QRCodeInfo['get' + capital(key)]()}`).join('&')

    return query
  }
}

export default new WechatService()