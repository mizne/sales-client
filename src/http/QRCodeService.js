import { qrcodeHttp, exceptionHandler } from './interceptors'

class QRCodeService {
  getQRCodeInfo(qrcodeId) {

    return qrcodeHttp.get(`/QRCodeTemplate?QRCodeTemplateId=${qrcodeId}`)
    .catch(exceptionHandler('QRCodeService', 'getQRCodeInfo'))
  }
}

export default new QRCodeService()
