import { getBizTypeHttp, exceptionHandler } from './interceptors'
import storage from '@/util/storage'

class TenantService {
  getConfig() {
    const query = `?tenantId=${storage.get('tenantId')}`

    return getBizTypeHttp()
      .get(`/tenantInfo${query}`)
      .catch(exceptionHandler('TenantService', 'getConfig'))
  }
}

export default new TenantService()