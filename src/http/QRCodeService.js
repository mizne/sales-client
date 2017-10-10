import { qrcodeHttp } from './interceptors'
import { BaseService } from './BaseService'
import QRCodeInfo from '@/models/QRCodeInfo'

class QRCodeService extends BaseService {
    getQRCodeInfo(qrcodeId) {
      return  qrcodeHttp.get(`/QRCodeTemplate?QRCodeTemplateId=${qrcodeId}`)
        .catch(this.exceptionHandler('QRCodeService', 'getQRCodeInfo'))
  }
}

export default new QRCodeService()
