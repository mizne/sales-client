import QRCodeInfo, { capital } from '@/models/QRCodeInfo'
import { dealHttp, eshopHttp, epayHttp, ipayHttp } from './interceptors'
import { DEAL, ESHOP, GROUP_SHOPPING, MULTI_ESHOP, FETCH_OPENID, EPAY, IPAY } from '@/util/constants'
import Logger from '../util/error-logger'

export class BaseService {
  getBizTypeQuery(map) {
    const keys = map[QRCodeInfo.getBizType()]
    if (!keys) {
      throw new Error(`Unknown biz type: ${QRCodeInfo.getBizType()}`)
    }

    const query =
      `?` +
      keys.map(key => `${key}=${QRCodeInfo['get' + capital(key)]()}`).join('&')
    return query
  }

  addBizTypeParams(params, map) {
    const keys = map[QRCodeInfo.getBizType()]
    if (!keys) {
      console.error(`Unknown biz type: ${QRCodeInfo.getBizType()}`)
      throw new Error(`Unknown biz type: ${QRCodeInfo.getBizType()}`)
    }

    Object.assign(
      params,
      keys.reduce((accu, curr) => {
        accu[curr] = QRCodeInfo['get' + capital(curr)]()
        return accu
      }, {})
    )
  }

  getBizTypeHttp() {
    const map = {
      [DEAL]: dealHttp,
      [ESHOP]: eshopHttp,
      [GROUP_SHOPPING]: eshopHttp,
      [MULTI_ESHOP]: eshopHttp,
      [FETCH_OPENID]: eshopHttp,
      [EPAY]: epayHttp,
      [IPAY]: ipayHttp
    }

    if (!map[QRCodeInfo.getBizType()]) {
      return Logger.error({
        module: 'interceptors',
        method: 'getBizTypeHttp',
        description: `Unknown biz type: ${QRCodeInfo.getBizType()}}`
      })
    }

    return map[QRCodeInfo.getBizType()]
  }

  exceptionHandler(module, method) {
    return err => {
      Logger.error({
        module,
        method,
        description: `${method} failed; err: ${err.message}`
      })
      return Promise.reject(new Error(err.message || '服务器繁忙'))
    }
  }
}
