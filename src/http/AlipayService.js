import { getBizTypeHttp, exceptionHandler } from './interceptors'
import { DEAL, ESHOP } from '@/util/constants'
import QRCodeInfo, { capital } from '@/models/QRCodeInfo'

class AlipayService {
  getWapParams(tradeNo) {
    const query = this._getQuery()

    return getBizTypeHttp()
      .get(`/alipay/wap${query}&tradeNo=${tradeNo}`)
      .catch(exceptionHandler('AlipayService', 'getWapParams'))
  }

  _getQuery() {
    const keys =
      QRCodeInfo.isDealBizType()
        ? ['tenantId', 'tableName', 'phoneNumber']
        : ['tenantId', 'consigneeId', 'tableName', 'phoneNumber']

    const query =
      `?` +
      keys.map(key => `${key}=${QRCodeInfo['get' + capital(key)]()}`).join('&')

    return query
  }
}

export default new AlipayService()
