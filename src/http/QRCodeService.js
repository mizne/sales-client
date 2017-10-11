import { qrcodeHttp } from './interceptors'
import { BaseService } from './BaseService'
import QRCodeInfo from '@/models/QRCodeInfo'

class QRCodeService extends BaseService {
    getQRCodeInfo(qrcodeId) {
      return  qrcodeHttp.get(`/QRCodeTemplate?QRCodeTemplateId=${qrcodeId}`)
        .catch(this.exceptionHandler('QRCodeService', 'getQRCodeInfo'))
  }
}


//缤纷汇 201708312100381153263
//e码付 201710111357459483951
//ipay 201709291029024212253
export default new QRCodeService()
