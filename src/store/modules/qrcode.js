import { QRCodeService } from '@/http/index'
import { DEAL, ESHOP, GROUP_SHOPPING } from '@/util/constants'
import QRCodeInfo from '@/models/QRCodeInfo'

const state = {
  industryLabel: '',
  tenantId: '',
  tableName: ''
}

const mutations = {
  SET_INDUSTRY_LABEL(state, industryLabel) {
    state.industryLabel = industryLabel
  },
  SET_TENANT_ID(state, tenantId) {
    QRCodeInfo.setTenantId(tenantId)
    state.tenantId = tenantId
  },
  SET_TABLE_NAME(state, tableName) {
    QRCodeInfo.setTableName(tableName)
    state.tableName = tableName
  }
}

const actions = {
  FETCH_QRCODE_INFO: ({ commit }, qrcodeId) => {
    return QRCodeService.getQRCodeInfo(qrcodeId).then(info => {
      // 点餐业务、单代售业务、群购业务
      // if (info.length === 1) {
      if (Object.prototype.toString.call(info) === '[object Object]') {
        info = [info]


        QRCodeInfo.setQrcodeId(qrcodeId)
        QRCodeInfo.setBizType(info[0].bizType)
        QRCodeInfo.setTableName(info[0].tableName)

        if (info[0].bizType === ESHOP || info[0].bizType === GROUP_SHOPPING) {
          // 代售单个商户、群购
          QRCodeInfo.setTenantId(info[0].tenantId)
          commit('SET_TENANT_ID', info[0].tenantId)
          QRCodeInfo.setConsigneeId(info[0].consigneeId)

          QRCodeInfo.removeTenants()
        } else if (info[0].bizType === DEAL) {
          // 点餐业务
          QRCodeInfo.setTenantId(info[0].tenantId)
          commit('SET_TENANT_ID', info[0].tenantId)

          QRCodeInfo.removeConsigneeId()
          QRCodeInfo.removeTenants()
        }

        // 存储多条优惠券信息
        if (info.coupons) {
          QRCodeInfo.setCoupons(info[0].coupons)
          QRCodeInfo.setCouponRate(info[0].couponRate)
        } else {
          QRCodeInfo.removeCoupons()
          QRCodeInfo.removeCouponRate()
        }
        // 酒店代售二维码 代售多个商户 未处理优惠券信息
      } else if (info.length >= 2) {
        QRCodeInfo.setQrcodeId(qrcodeId)
        QRCodeInfo.setBizType(ESHOP)
        QRCodeInfo.setConsigneeId(info[0].consigneeId)
        QRCodeInfo.setTenantId('tenantId0')

        const tenants = info.map(e => ({
          id: e.tenantId,
          name: e.merchantName,
          industry: e.industry,
          tableName: e.tableName,
          homeImage: e.homeImage
        }))

        QRCodeInfo.setTenants(tenants)
      } else {
        console.error(`qrcode template id error; id: ${qrcodeId}`)
      }
    })
  }
}

const getters = {
  industryLabel(state) {
    return state.industryLabel
  },
  tenantId(state) {
    return state.tenantId
  },
  tableName(state) {
    return state.tableName
  }
}

export { state, mutations, actions, getters }
