import QRCodeInfo from '@/models/QRCodeInfo'
import { BaseService } from './BaseService'
import { DEAL, ESHOP, GROUP_SHOPPING, MULTI_ESHOP } from '@/util/constants'

class UserService extends BaseService {
  getStatus() {
    const map = {
      [DEAL]: this._getStatusForDeal.bind(this),
      [ESHOP]: this._getStatusForEShop.bind(this),
      [GROUP_SHOPPING]: this._getStatusForEShop.bind(this),
      [MULTI_ESHOP]: this._getStatusForEShop.bind(this)
    }

    if (!map[QRCodeInfo.getBizType()]) {
      throw new Error(`Unknown biz type: ${QRCodeInfo.getBizType()}`)
    }

    return map[QRCodeInfo.getBizType()]()
  }

  getDeliveryFee(distance) {
    return this.getBizTypeHttp()
    .get(`/deliveryFee?distance=${distance}&tenantId=${QRCodeInfo.getTenantId()}`)
    .catch(this.exceptionHandler('UserService', 'getDeliveryFee'))
  }

  _getStatusForDeal() {
    const map = {
      [DEAL]: ['tenantId', 'tableName']
    }
    const query = this.getBizTypeQuery(map)

    return this.getBizTypeHttp()
      .get(`/table${query}`)
      .catch(this.exceptionHandler('UserService', 'getStatus'))
  }

  _getStatusForEShop() {
    if (QRCodeInfo.hasPhoneNumber()) {
      const map = {
        [ESHOP]: ['tenantId', 'tableName', 'consigneeId', 'phoneNumber'],
        [GROUP_SHOPPING]: ['tenantId', 'tableName', 'consigneeId', 'phoneNumber'],
        [MULTI_ESHOP]: ['tenantId', 'tableName', 'consigneeId', 'phoneNumber']
      }

      let query = this.getBizTypeQuery(map)

      return this.getBizTypeHttp()
        .get(`/table${query}`)
        .catch(this.exceptionHandler('UserService', 'getStatus'))
    } else {
      return Promise.resolve({
        isVip: false,
        tableStatus: 0
      })
    }
  }
}

export default new UserService()
