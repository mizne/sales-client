import { QRCodeService } from '@/http/index'
import { ESHOP } from '@/util/constants'
import QRCodeInfo from '@/models/QRCodeInfo'

const state = {
}

const mutations = {
}

const actions = {
  FETCH_QRCODE_INFO: ({ commit }, qrcodeId) => {
    return QRCodeService.getQRCodeInfo(qrcodeId).then(info => {
      QRCodeInfo.setBizType(info.bizType)
      QRCodeInfo.setTenantId(info.tenantId)
      QRCodeInfo.setTableName(info.tableName)

      if (info.bizType === ESHOP) {
        QRCodeInfo.setConsigneeId(info.consigneeId)
      } else {
        QRCodeInfo.removeConsigneeId()
      }

      // 存储多条优惠券信息
      if (info.coupons) {
        QRCodeInfo.setCoupons(info.coupons)
        QRCodeInfo.setCouponRate(info.couponRate)
      } else {
        QRCodeInfo.removeCoupons()
        QRCodeInfo.removeCouponRate()
      }

      // storage.set('phoneNumber', '13721080281')// TOFIX 测试桩
    })
  }
}

const getters = {
}

export { state, mutations, actions, getters }
