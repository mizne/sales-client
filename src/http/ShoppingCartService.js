import QRCodeInfo from '@/models/QRCodeInfo'
import { DEAL, ESHOP, GROUP_SHOPPING } from '@/util/constants'
import { BaseService } from './BaseService'

class ShoppingCartService extends BaseService {
  addShoppingCart(params) {
    this._addParams(params)

    return this.getBizTypeHttp()
      .post('/shoppingCart', params)
      .then(tableUser => {
        if (QRCodeInfo.isDealBizType()) {
          QRCodeInfo.setTableUser(tableUser)
        }
      })
      .catch(this.exceptionHandler('ShopCartService', 'addShoppingCart'))
  }

  editShoppingCart(foodParams) {
    const params = this._getParams(foodParams)

    return this.getBizTypeHttp()
      .put('/shoppingCart', params)
      .catch(this.exceptionHandler('ShopCartService', 'editShoppingCart'))
  }

  getShoppingCart() {
    const query = this._getQuery()

    return this.getBizTypeHttp()
      .get(`/shoppingCart${query}`)
      .catch(this.exceptionHandler('ShopCartService', 'getShoppingCart'))
  }

  _addParams(params) {
    const map = {
      [DEAL]: ['tenantId', 'tableName'],
      [ESHOP]: ['tenantId', 'consigneeId', 'tableName', 'phoneNumber'],
      [GROUP_SHOPPING]: ['tenantId', 'consigneeId', 'tableName', 'phoneNumber']
    }

    this.addBizTypeParams(params, map)

    // 点餐业务 加上不同人的点餐标识
    if (QRCodeInfo.isDealBizType()) {
      if (QRCodeInfo.hasTableUser()) {
        Object.assign(params, { tableUser: QRCodeInfo.getTableUser() })
      }
    }
  }

  _getParams(foodParams) {
    const params = {
      condition: {},
      food: {
        foodId: foodParams.foodId,
        foodCount: foodParams.foodCount
      }
    }

    const map = {
      [DEAL]: ['tenantId', 'tableName'],
      [ESHOP]: ['tenantId', 'consigneeId', 'tableName', 'phoneNumber'],
      [GROUP_SHOPPING]: ['tenantId', 'consigneeId', 'tableName', 'phoneNumber']
    }

    this.addBizTypeParams(params.condition, map)
    // 点餐业务 加上不同人的点餐标识
    if (QRCodeInfo.isDealBizType()) {
      Object.assign(params.condition, { tableUser: foodParams.tableUser })
    }

    return params
  }

  _getQuery() {
    const map = {
      [DEAL]: ['tenantId', 'tableName'],
      [ESHOP]: ['tenantId', 'consigneeId', 'tableName', 'phoneNumber'],
      [GROUP_SHOPPING]: ['tenantId', 'consigneeId', 'tableName', 'phoneNumber']
    }
    return this.getBizTypeQuery(map)
  }
}

export default new ShoppingCartService()
