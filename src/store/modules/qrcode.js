import { QRCodeService } from '@/http/index'
import storage from '@/util/storage'
import { ESHOP } from '@/util/constants'

const state = {
}

const mutations = {
}

const actions = {
  FETCH_QRCODE_INFO: ({ commit }, qrcodeId) => {
    return QRCodeService.getQRCodeInfo(qrcodeId).then(info => {
      storage.set('bizType', info.bizType)
      storage.set('tenantId', info.tenantId)
      storage.set('tableName', info.tableName)

      if (info.bizType === ESHOP) {
        storage.set('consigneeId', info.consigneeId)
      } else {
        storage.remove('consigneeId')
      }

      // 存储多条优惠券信息
      if (info.coupons) {
        storage.set('coupons', info.coupons)
        storage.set('couponRate', '0.5')
      } else {
        storage.remove('coupons')
        storage.remove('couponRate')
      }

      // storage.set('phoneNumber', '13721080281')// TOFIX 测试桩
    })
  }
}

const getters = {
}

export { state, mutations, actions, getters }
