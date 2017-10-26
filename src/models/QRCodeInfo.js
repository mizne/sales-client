import storage from '@/util/storage'
import { DEAL, ESHOP, GROUP_SHOPPING, MULTI_ESHOP, FETCH_OPENID, EPAY, IPAY} from '@/util/constants'

const methods = [
  'qrcodeId',
  'bizType',
  'tenantId',
  'tenantName',
  'tenants',
  'tableName',
  'consigneeId',
  'consigneeName',
  'coupons',
  'couponRate',
  'tableUser',
  'phoneNumber',
  'PaymentMerchant'
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

QRCodeInfo.prototype.isMultiEShopBizType = function () {
  return this.getBizType() === MULTI_ESHOP
}

QRCodeInfo.prototype.isFetchOpenidBizType = function () {
  return this.getBizType() === FETCH_OPENID
}

QRCodeInfo.prototype.isEPayBizType = function () {
  return this.getBizType() === EPAY
}

QRCodeInfo.prototype.isIPayBizType = function () {
  return this.getBizType() === IPAY
}

QRCodeInfo.prototype.getShoppingCartRemarkPlaceholder = function() {
  if (this.isDealBizType()) {
    return '请填写备注'
  }

  if (this.isEShopBizType()) {
    return '特别提醒: 此处填写房号, 以便前台及时送达'
  }

  if (this.isMultiEShopBizType()) {
    return `该订单为${this.getConsigneeName()}代售商品, 请备注您的房间号`
  }

  if (this.isGroupShoppingBizType()) {
    return '该订单为群购订单, 请备注您的微信号'
  }

  throw new Error('impossible')
}

QRCodeInfo.prototype.needPromptFillOrderRemark = function () {
  return this.isMultiEShopBizType() || this.isEShopBizType()
}

QRCodeInfo.prototype.getBizTypeText = function() {
  const map = {
    [DEAL]: '选购',
    [ESHOP]: '选购',
    [GROUP_SHOPPING]: '群购'
  }
  return map[this.getBizType()]
}

QRCodeInfo.prototype.getDocumentTitle = function() {
  const map = {
    [DEAL]: '小v24小时便利',
    [ESHOP]: '小v宝e代售',
    [GROUP_SHOPPING]: '小v宝e群购'
  }
  return map[this.getBizType()]
}

// 批量添加方法
methods.forEach(method => {
  // 添加 set 方法
  QRCodeInfo.prototype['set' + capital(method)] = function(v) {
    storage.set(addPrefix(method), v)
    return this
  }

  // 添加 get 方法
  QRCodeInfo.prototype['get' + capital(method)] = function() {
    return storage.get(addPrefix(method))
  }

  // 添加 has 方法
  QRCodeInfo.prototype['has' + capital(method)] = function(v) {
    return this['get' + capital(method)]() != null
  }

  // 添加 remove 方法
  QRCodeInfo.prototype['remove' + capital(method)] = function() {
    storage.remove(addPrefix(method))
    return this
  }
})

function addPrefix(method) {
  return `XIAO_V_BAO_${method}`
}

// 将字符串 s 首字母大写
export function capital(s) {
  return s[0].toUpperCase() + s.slice(1)
}

export default new QRCodeInfo()
