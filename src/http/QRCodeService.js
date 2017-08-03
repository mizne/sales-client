import { qrcodeHttp } from './interceptors'
import { BaseService } from './BaseService'

class QRCodeService extends BaseService {
  getQRCodeInfo(qrcodeId) {

    return qrcodeHttp.get(`/QRCodeTemplate?QRCodeTemplateId=${qrcodeId}`)
    .catch(this.exceptionHandler('QRCodeService', 'getQRCodeInfo'))
    
    // const fakeInfo = qrcodeId === '1'
    // ? {
    //   bizType: 'eshop',
    //   tenantIds: ['18d473e77f459833bb06c60f9a8f0000', '18d473e77f459833bb06c60f9a8f0002', '18d473e77f459833bb06c60f9a8f0001'],
    //   tableName: '0号桌',
    //   consigneeId: '28d473e77f459833bb06c60f9a8f0001'
    // }
    // : {
    //   bizType: 'eshop',
    //   tenantId: '18d473e77f459833bb06c60f9a8f0000',
    //   tableName: '0号桌',
    //   consigneeId: '28d473e77f459833bb06c60f9a8f0000'
    // }

    // return Promise.resolve(fakeInfo)
  }
}

export default new QRCodeService()
