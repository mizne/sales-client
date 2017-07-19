import { loggerHttp } from './interceptors'
import storage from '@/util/storage'

const info = function (params) {
  Object.assign(params, {
    tenantId: storage.get('tenantId'),
    consigneeId: storage.get('consigneeId'),
    tableName: storage.get('tableName'),
    phoneNumber: storage.get('phoneNumber') || 'Unknow phone',
    level: 'INFO',
  })

  return loggerHttp.post('/eshop-client/error-message', params)
  .catch(err => {
    // ignore
  })

}

const error = function (params) {
  Object.assign(params, {
    tenantId: storage.get('tenantId'),
    consigneeId: storage.get('consigneeId'),
    tableName: storage.get('tableName'),
    phoneNumber: storage.get('phoneNumber') || 'Unknow phone',
    level: 'ERROR',
  })

  return loggerHttp.post('/eshop-client/error-message', params)
  .catch(err => {
    // ignore
  })
}


export {
  info,
  error
}