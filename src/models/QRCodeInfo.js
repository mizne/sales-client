import storage from '@/util/storage'
import { DEAL, ESHOP, GROUP_SHOPPING } from '@/util/constants'

const methods = [
  'bizType',
  'tenantId',
  'tableName',
  'consigneeId',
  'coupons',
  'couponRate',
  'tableUser',
  'phoneNumber'
]
const QRCodeInfo = function() {}

QRCodeInfo.prototype.isDealBizType = function() {
  return this.getBizType() === DEAL
}

QRCodeInfo.prototype.isEShopBizType = function() {
  return this.getBizType() === ESHOP
}

QRCodeInfo.prototype.isGroupShoppingBizType = function() {
  return this.getBizType() === GROUP_SHOPPING
}

// 批量添加 set 方法
methods.forEach(method => {
  // 添加 set 方法
  QRCodeInfo.prototype['set' + capital(method)] = function(v) {
    storage.set(method, v)
    return this
  }

  // 添加 get 方法
  QRCodeInfo.prototype['get' + capital(method)] = function() {
    return storage.get(method)
  }

  // 添加 has 方法
  QRCodeInfo.prototype['has' + capital(method)] = function(v) {
    return this['get' + capital(method)]() != null
  }

  // 添加 remove 方法
  QRCodeInfo.prototype['remove' + capital(method)] = function() {
    storage.remove(method)
    return this
  }
})

// 将字符串 s 首字母大写
export function capital(s) {
  return s[0].toUpperCase() + s.slice(1)
}

export default new QRCodeInfo()
