import { loggerHttp } from './interceptors'
import QRCodeInfo, { capital } from '@/models/QRCodeInfo'

const info = function(params) {
  return _request('INFO', params)
}

const error = function(params) {
  return _request('ERROR', params)
}

function _request(level, params) {
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

  console.log(url, params)

  return loggerHttp.post(url, params).catch(err => {
    // ignore
  })
}

export default { info, error }
