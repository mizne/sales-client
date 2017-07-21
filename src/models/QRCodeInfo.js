import storage from '@/util/storage'
import { DEAL, ESHOP } from '@/util/constants'

const QRCodeInfo = function() {}

QRCodeInfo.prototype.isDealBizType = function() {
  return this.getBizType() === DEAL
}

QRCodeInfo.prototype.isEShopBizType = function() {
  return this.getBizType() === ESHOP
}

// 批量添加 set 方法
;[
  'bizType',
  'tenantId',
  'tableName',
  'consigneeId',
  'coupons',
  'couponRate',
  'tableUser',
  'phoneNumber'
].forEach(method => {
  QRCodeInfo.prototype['set' + capital(method)] = function(v) {
    storage.set(method, v)
    return this
  }
})

// 批量添加 get 方法
;[
  'bizType',
  'tenantId',
  'tableName',
  'consigneeId',
  'coupons',
  'couponRate',
  'tableUser',
  'phoneNumber'
].forEach(method => {
  QRCodeInfo.prototype['get' + capital(method)] = function() {
    return storage.get(method)
  }
})

// 批量添加 has 方法
;[
  'bizType',
  'tenantId',
  'tableName',
  'consigneeId',
  'coupons',
  'couponRate',
  'tableUser',
  'phoneNumber'
].forEach(method => {
  QRCodeInfo.prototype['has' + capital(method)] = function(v) {
    return this['get' + capital(method)]() != null
  }
})

// 批量添加 remove 方法
;[
  'bizType',
  'tenantId',
  'tableName',
  'consigneeId',
  'coupons',
  'couponRate',
  'tableUser',
  'phoneNumber'
].forEach(method => {
  QRCodeInfo.prototype['remove' + capital(method)] = function() {
    storage.remove(method)
    return this
  }
})

export function capital(s) {
  return s[0].toUpperCase() + s.slice(1)
}

export default new QRCodeInfo()
