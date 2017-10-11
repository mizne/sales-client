import {
  DEAL,
  ESHOP,
  GROUP_SHOPPING,
  MULTI_ESHOP,
  FETCH_OPENID
} from '@/util/constants'
import { BaseService } from './BaseService'
import { epayHttp } from './interceptors'
import QRCodeInfo from '@/models/QRCodeInfo'

class WechatService extends BaseService {
  redirectForPay() {
    return this.getBizTypeHttp()
      .get(`/wechatpay/redirectUrl`)
      .catch(this.exceptionHandler('WechatService', 'redirectForPay'))
  }

  // e码付业务 获取重定向地址
  redirectForEPay() {
    return this.getBizTypeHttp()
    .get(`/wechatpay/redirectUrl`)
    .catch(this.exceptionHandler('WechatService', 'redirectForEPay'))
  }

  OnlineRedirectForEPay() {
    return epayHttp.get(`/wechatpay/redirectUrl`)
      .catch(this.exceptionHandler('WechatService', 'OnlineRedirectForEPay'))
  }

  redirectForIPay() {
    return this.getBizTypeHttp()
      .get(`/wechatpay/redirectUrl`)
      .catch(this.exceptionHandler('WechatService', 'redirectForIPay'))
  }

  redirectForOpenId() {
    return this.getBizTypeHttp()
      .get(`/fetch-openid/redirectUrl`)
      .catch(this.exceptionHandler('WechatService', 'redirectForOpenid'))
  }

  getWechatPayParams(code) {
    let query = this._getQuery()
    query += `&code=${code}`

    return this.getBizTypeHttp()
      .get(`/wechatpay/wap${query}`)
      .catch(this.exceptionHandler('WechatService', 'getWechatPayParams'))
  }

  getWechatPayParamsForEPay(code, amount) {
    const query = `?qrcodeId=${QRCodeInfo.getQrcodeId()}&code=${code}&amount=${amount}`

    return this.getBizTypeHttp()
    .get(`/wechatpay${query}`)
    .catch(this.exceptionHandler('WechatService', 'getWechatPayParamsForEPay'))
  }

  OnlineWechatPayParamsForEPay(code, amount) {
    const query = `?qrcodeId=${QRCodeInfo.getQrcodeId()}&code=${code}&amount=${amount}`

    return epayHttp.get(`/wechatpay${query}`)
      .catch(this.exceptionHandler('WechatService', 'OnlineWechatPayParamsForEPay'))
  }

  getWechatPayParamsForIPay(code, amount) {
    const query = `?qrcodeId=${QRCodeInfo.getQrcodeId()}&code=${code}&amount=${amount}`

    return this.getBizTypeHttp()
      .get(`/wechatpay${query}`)
      .catch(this.exceptionHandler('WechatService', 'getWechatPayParamsForIPay'))
  }

  getOpenId(code) {
    let query = this._getQuery()
    query += `&code=${code}`

    return this.getBizTypeHttp()
      .get(`/fetch-openid/wap${query}`)
      .catch(this.exceptionHandler('WechatService', 'getOpenId'))
  }

  _getQuery(code) {
    const map = {
      [DEAL]: ['tenantId', 'tableName', 'phoneNumber'],
      [ESHOP]: ['tenantId', 'consigneeId', 'tableName', 'phoneNumber'],
      [GROUP_SHOPPING]: ['tenantId', 'consigneeId', 'tableName', 'phoneNumber'],
      [MULTI_ESHOP]: ['tenantId', 'consigneeId', 'tableName', 'phoneNumber'],
      [FETCH_OPENID]: ['tenantId']
    }
    return this.getBizTypeQuery(map)
  }
}

export default new WechatService()
