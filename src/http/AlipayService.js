import { getBizTypeHttp, exceptionHandler } from './interceptors'
import storage from '@/util/storage'
import { DEAL, ESHOP } from '@/util/constants'

class AlipayService {
  getWapParams(tradeNo) {
    const query = this._getQuery()

    return getBizTypeHttp()
      .get(`/alipay/wap${query}&tradeNo=${tradeNo}`)
      .catch(exceptionHandler('AlipayService', 'getWapParams'))
  }

  _getQuery() {
    const keys =
      storage.get('bizType') === DEAL
        ? ['tenantId', 'tableName', 'phoneNumber']
        : ['tenantId', 'consigneeId', 'tableName', 'phoneNumber']

    const query =
      `?` +
      keys.map(key => `${key}=${storage.get(key)}`).join('&')

    return query
  }
}

export default new AlipayService()
