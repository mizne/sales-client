import { DEAL, ESHOP, GROUP_SHOPPING, MULTI_ESHOP } from '@/util/constants'
import { BaseService } from './BaseService'

class AlipayService extends BaseService {
  getWapParams(tradeNo) {
    const query = this._getQuery()

    return this.getBizTypeHttp()
      .get(`/alipay/wap${query}&tradeNo=${tradeNo}`)
      .catch(this.exceptionHandler('AlipayService', 'getWapParams'))
  }

  getEPayParams(qrcodeId, amount) {

    return this.getBizTypeHttp()
    .get(`/alipay?qrcodeId=${qrcodeId}&amount=${amount}`)
    .catch(this.exceptionHandler('AlipayService', 'getEPayParams'))
  }

  _getQuery() {
    const map = {
      [DEAL]: ['tenantId', 'tableName', 'phoneNumber'],
      [ESHOP]: ['tenantId', 'consigneeId', 'tableName', 'phoneNumber'],
      [GROUP_SHOPPING]: ['tenantId', 'consigneeId', 'tableName', 'phoneNumber'],
      [MULTI_ESHOP]: ['tenantId', 'consigneeId', 'tableName', 'phoneNumber']
    }
    return this.getBizTypeQuery(map)
  }
}

export default new AlipayService()
