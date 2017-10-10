import { loggerHttp } from './interceptors'
import QRCodeInfo, { capital } from '@/models/QRCodeInfo'
import { DEAL, ESHOP, GROUP_SHOPPING, MULTI_ESHOP, FETCH_OPENID, EPAY, IPAY } from '@/util/constants'

class Logger {
  info(params) {
    return this._request('INFO', params)
  }

  error(params) {
    return this._request('ERROR', params)
  }

  _request(level, params) {
    const map = {
      [DEAL]: ['tenantId', 'tableName', 'phoneNumber'],
      [ESHOP]: ['tenantId', 'tableName', 'phoneNumber', 'consigneeId'],
      [GROUP_SHOPPING]: ['tenantId', 'tableName', 'phoneNumber', 'consigneeId'],
      [MULTI_ESHOP]: ['tenantId', 'tableName', 'phoneNumber', 'consigneeId'],
      [FETCH_OPENID]: ['tenantId'],
      [EPAY]: ['qrcodeId'],
      [IPAY]: ['qrcodeId']
    }

    const urlMap = {
      [DEAL]: '/deal-client/error-message',
      [ESHOP]: '/eshop-client/error-message',
      [GROUP_SHOPPING]: '/eshop-client/error-message',
      [MULTI_ESHOP]: '/eshop-client/error-message',
      [FETCH_OPENID]: '/eshop-client/error-message',
      [EPAY]: '/eshop-client/error-message',
      [IPAY]: '/eshop-client/error-message'
    }

    const url = urlMap[QRCodeInfo.getBizType()]

    Object.assign(params, { level })
    const keys = map[QRCodeInfo.getBizType()]
    if (!keys) {
      const errorMsg = `Unknown biz type: ${QRCodeInfo.getBizType()}`
      console.error(errorMsg)
      throw new Error(errorMsg)
    }
    Object.assign(
      params,
      keys.reduce((accu, curr) => {
        accu[curr] = QRCodeInfo['get' + capital(curr)]()
        return accu
      }, {})
    )

    return loggerHttp.post(url, params).catch(err => {
      // ignore
    })
  }
}

export default new Logger()
