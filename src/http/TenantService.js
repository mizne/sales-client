import { getBizTypeHttp, exceptionHandler } from './interceptors'
import QRCodeInfo from '@/models/QRCodeInfo'

class TenantService {
  getConfig() {
    const query = `?tenantId=${QRCodeInfo.getTenantId()}`

    return getBizTypeHttp()
      .get(`/tenantInfo${query}`)
      .catch(exceptionHandler('TenantService', 'getConfig'))
  }
}

export default new TenantService()