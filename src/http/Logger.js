import { loggerHttp } from './interceptors'
import QRCodeInfo, { capital } from '@/models/QRCodeInfo'

const info = function(params) {
  return _request('INFO')
}

const error = function(params) {
  return _request('ERROR')
}

function _request(level) {
  Object.assign(params, {
    tenantId: QRCodeInfo.getTenantId(),
    tableName: QRCodeInfo.getTableName(),
    phoneNumber: QRCodeInfo.getPhoneNumber() || 'Unknow phone',
    level
  })

  let url
  if (QRCodeInfo.isDealBizType()) {
    url = '/deal-client/error-message'
  } else if (QRCodeInfo.isEShopBizType()) {
    url = '/eshop-client/error-message'
    params.consigneeId = QRCodeInfo.getConsigneeId()
  }

  return loggerHttp.post(url, params).catch(err => {
    // ignore
  })
}

export { info, error }
