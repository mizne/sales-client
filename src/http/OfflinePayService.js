import { DEAL, ESHOP, GROUP_SHOPPING, MULTI_ESHOP } from '@/util/constants'
import { epayHttp } from './interceptors'
import { BaseService } from './BaseService'

import QRCodeInfo, { capital } from '@/models/QRCodeInfo'

class OfflinePayService extends BaseService {
  payOffline(tradeNo) {
    const query = `?tenantId=${QRCodeInfo['get' + capital('tenantId')]()}&tradeNo=${tradeNo}`

    return this.getBizTypeHttp()
      .put(`/offlinePayment`, {
        tenantId: QRCodeInfo['get' + capital('tenantId')](),
        tradeNo
      })
      .catch(this.exceptionHandler('OfflinePayService', 'payOffline'))
  }
}

export default new OfflinePayService()
