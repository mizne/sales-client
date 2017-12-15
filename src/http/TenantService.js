import QRCodeInfo from '@/models/QRCodeInfo'
import { BaseService } from './BaseService'

class TenantService extends BaseService {
  getConfig() {
    const query = `?tenantId=${QRCodeInfo.getTenantId()}`

    return this.getBizTypeHttp()
      .get(`/tenantInfo${query}`)
      .catch(this.exceptionHandler('TenantService', 'getConfig'))
  }
}

export default new TenantService()
