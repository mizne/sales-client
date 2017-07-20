import { getBizTypeHttp, exceptionHandler } from './interceptors'
import QRCodeInfo, { capital } from '@/models/QRCodeInfo'

class ShoppingCartService {
  addShoppingCart(params) {
    this._addParams(params)

    return getBizTypeHttp()
      .post('/shoppingCart', params)
      .then(tableUser => {
        if (QRCodeInfo.isDealBizType()) {
          QRCodeInfo.setTableUser(tableUser)
        }
      })
      .catch(exceptionHandler('ShopCartService', 'addShoppingCart'))
  }

  editShoppingCart(foodParams) {
    const params = this._getParams(foodParams)

    return getBizTypeHttp()
      .put('/shoppingCart', params)
      .catch(exceptionHandler('ShopCartService', 'editShoppingCart'))
  }

  getShoppingCart() {
    const query = this._getQuery()

    return getBizTypeHttp()
      .get(`/shoppingCart${query}`)
      .catch(exceptionHandler('ShopCartService', 'getShoppingCart'))
  }

  _addParams(params) {
    if (QRCodeInfo.isDealBizType()) {
      Object.assign(params, {
        tenantId: QRCodeInfo.getTenantId(),
        tableName: QRCodeInfo.getTableName()
      })
      if (QRCodeInfo.hasTableUser()) {
        params.tableUser = QRCodeInfo.getTableUser()
      }
    } else if (QRCodeInfo.isEShopBizType()) {
      Object.assign(params, {
        tenantId: QRCodeInfo.getTenantId(),
        consigneeId: QRCodeInfo.getConsigneeId(),
        tableName: QRCodeInfo.getTableName(),
        phoneNumber: QRCodeInfo.getPhoneNumber()
      })
    } else {
      console.error(`Unknown biz type: ${QRCodeInfo.getBizType()}`)
    }
  }

  _getParams(foodParams) {
    if (QRCodeInfo.isDealBizType()) {
      return {
        condition: {
          tenantId: QRCodeInfo.getTenantId(),
          tableName: QRCodeInfo.getTableName(),
          tableUser: foodParams.tableUser
        },
        food: {
          foodId: foodParams.foodId,
          foodCount: foodParams.foodCount
        }
      }
    } else if (QRCodeInfo.isEShopBizType()) {
      return {
        condition: {
          tenantId: QRCodeInfo.getTenantId(),
          consigneeId: QRCodeInfo.getConsigneeId(),
          tableName: QRCodeInfo.getTableName(),
          phoneNumber: QRCodeInfo.getPhoneNumber()
        },
        food: {
          foodId: foodParams.foodId,
          foodCount: foodParams.foodCount
        }
      }
    } else {
      console.error(`Unknown biz type: ${QRCodeInfo.getBizType()}`)
    }
  }

  _getQuery() {
    const keys =
      QRCodeInfo.isDealBizType()
        ? ['tenantId', 'tableName']
        : ['tenantId', 'consigneeId', 'tableName', 'phoneNumber']

    const query = `?` + keys.map(key => `${key}=${QRCodeInfo['get' + capital(key)]()}`).join('&')

    return query
  }
}

export default new ShoppingCartService()
