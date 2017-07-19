import { getBizTypeHttp, exceptionHandler } from './interceptors'
import storage from '@/util/storage'
import { DEAL, ESHOP } from '@/util/constants'

class ShoppingCartService {
  addShoppingCart(params) {
    this._addParams(params)

    return getBizTypeHttp()
      .post('/shoppingCart', params)
      .then(tableUser => {
        const bizType = storage.get('bizType')
        if (bizType === DEAL) {
          storage.set('tableUser', tableUser)
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
    const bizType = storage.get('bizType')
    if (bizType === DEAL) {
      Object.assign(params, {
        tenantId: storage.get('tenantId'),
        tableName: storage.get('tableName')
      })
      if (storage.has('tableUser')) {
        params.tableUser = storage.get('tableUser')
      }
    } else if (bizType === ESHOP) {
      Object.assign(params, {
        tenantId: storage.get('tenantId'),
        consigneeId: storage.get('consigneeId'),
        tableName: storage.get('tableName'),
        phoneNumber: storage.get('phoneNumber')
      })
    } else {
      console.error(`Unknown biz type: ${bizType}`)
    }
  }

  _getParams(foodParams) {
    const bizType = storage.get('bizType')

    if (bizType === DEAL) {
      return {
        condition: {
          tenantId: storage.get('tenantId'),
          tableName: storage.get('tableName'),
          tableUser: foodParams.tableUser
        },
        food: {
          foodId: foodParams.foodId,
          foodCount: foodParams.foodCount
        }
      }
    } else if (bizType === ESHOP) {
      return {
        condition: {
          tenantId: storage.get('tenantId'),
          consigneeId: storage.get('consigneeId'),
          tableName: storage.get('tableName'),
          phoneNumber: storage.get('phoneNumber')
        },
        food: {
          foodId: foodParams.foodId,
          foodCount: foodParams.foodCount
        }
      }
    } else {
      console.error(`Unknown biz type: ${bizType}`)
    }
  }

  _getQuery() {
    const keys =
      storage.get('bizType') === DEAL
        ? ['tenantId', 'tableName']
        : ['tenantId', 'consigneeId', 'tableName', 'phoneNumber']

    const query = `?` + keys.map(key => `${key}=${storage.get(key)}`).join('&')

    return query
  }
}

export default new ShoppingCartService()
