import { qrcodeHttp } from './interceptors'
import { BaseService } from './BaseService'
import QRCodeInfo from '@/models/QRCodeInfo'

class QRCodeService extends BaseService {
    getQRCodeInfo(qrcodeId) {
      return  qrcodeHttp.get(`/QRCodeTemplate?QRCodeTemplateId=${qrcodeId}`)
        .catch(this.exceptionHandler('QRCodeService', 'getQRCodeInfo'))
  }
}

//201709291519513502214 测试
//201709282004086717356 服务
//qrcodeId
//201708312100381153263
export default new QRCodeService()
