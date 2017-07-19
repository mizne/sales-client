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

      if (info.couponType) {
        storage.set('couponType', info.couponType)
        storage.set('couponValue', info.couponValue)
        storage.set('couponRate', info.couponRate)
      } else {
        storage.remove('couponType')
        storage.remove('couponValue')
        storage.remove('couponRate')
      }

      // storage.set('phoneNumber', '13721080281')// TOFIX 测试桩
    })
  }
}

const getters = {
}

export { state, mutations, actions, getters }
