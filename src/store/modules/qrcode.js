import { QRCodeService } from '@/http/index'
import {
  DEAL,
  ESHOP,
  GROUP_SHOPPING,
  MULTI_ESHOP,
  FETCH_OPENID,
  EPAY,
  IPAY
} from '@/util/constants'
import QRCodeInfo from '@/models/QRCodeInfo'
import {
  generateRandom,
  dateBetween,
  computeDistanceBetween
} from '@/util/index'

import { vAlert } from '@/util/vux-wrapper'

const state = {
  industryLabel: '',
  industryImg: '',
  tenantId: '',
  tableName: ''
}

const mutations = {
  SET_INDUSTRY_LABEL(state, industryLabel) {
    state.industryLabel = industryLabel
  },
  SET_INDUSTRY_IMG(state, industryImg) {
    state.industryImg = industryImg
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
  FETCH_QRCODE_INFO: ({ commit, dispatch }, qrcodeId) => {
    return QRCodeService.getQRCodeInfo(qrcodeId,).then(info => {
      info = info[0]
      QRCodeInfo.setQrcodeId(qrcodeId)

      // e码付
      if (info.bizType === EPAY) {
        QRCodeInfo.setBizType(info.bizType)
        QRCodeInfo.setTenantId(info.tenantId)
        QRCodeInfo.setTenantName(info.merchantName)
        return info
      }

      if (info.bizType === IPAY) {
        QRCodeInfo.setBizType(info.bizType)
        QRCodeInfo.setTenantId(info.tenantId)
        QRCodeInfo.setTenantName(info.merchantName)
        QRCodeInfo.setPaymentMerchant(info.paymentMerchant)
        return info
      }

      //获取商家微信openid
      if (info.bizType === FETCH_OPENID) {
        QRCodeInfo.setBizType(info.bizType)
        QRCodeInfo.setTenantId(info.tenantId)
        return info
      }

      // 点餐业务、单代售业务、群购业务
      // if (info.length === 1) {
      if (Object.prototype.toString.call(info) === '[object Object]') {
        QRCodeInfo.setBizType(info.bizType)
        QRCodeInfo.setTableName(info.tableName)

        if (info.bizType === ESHOP || info.bizType === GROUP_SHOPPING) {
          // 代售单个商户、群购
          QRCodeInfo.setTenantId(info.tenantId)
          commit('SET_TENANT_ID', info.tenantId)
          QRCodeInfo.setConsigneeId(info.consigneeId)

          QRCodeInfo.removeTenants()
        } else if (info.bizType === DEAL) {
          // 点餐业务
          QRCodeInfo.setTenantId(info.tenantId)
          commit('SET_TENANT_ID', info.tenantId)

          QRCodeInfo.removeConsigneeId()
          QRCodeInfo.removeTenants()
        }

        // 存储多条优惠券信息
        if (info.coupons) {
          QRCodeInfo.setCoupons(info.coupons)
          QRCodeInfo.setCouponRate(info.couponRate)
        } else {
          QRCodeInfo.removeCoupons()
          QRCodeInfo.removeCouponRate()
        }
        // 酒店代售二维码 代售多个商户 未处理优惠券信息
      } else if (info.length >= 2) {
        QRCodeInfo.setBizType(MULTI_ESHOP)
        // 便于验证电话号码 此时没有tenantId
        QRCodeInfo.setTenantId('tenantId0')
        QRCodeInfo.setConsigneeId(info[0].consigneeId)
        QRCodeInfo.setConsigneeName(info[0].consigneeName)

        const tenants = info.map(e => ({
          id: e.tenantId,
          name: e.merchantName,
          industry: e.industry,
          tableName: e.tableName,
          address: e.address,
          openFlag: e.tenantInfo.openFlag,
          homeImage: e.tenantInfo.homeImage,
          description: `起送价${e.startPrice || 30}元|配送费${e.deliveryFee || 5}元`,
          officialNews: e.tenantInfo.officialNews,
          sellCountPerMonth: generateRandom(100, 1000),
          close: !dateBetween(e.tenantInfo.startTime, e.tenantInfo.endTime),
          distance: '计算中...'
        }))

        // 获取用户地理位置 并 计算商户和用户的距离
        dispatch('FETCH_USER_POSITION').then(({ lat, lng }) => {
          const distances = info.map(e => computeDistanceBetween({lat, lng}, {
            lat: e.tenantInfo.latitude,
            lng: e.tenantInfo.longitude
          }))
          commit('SET_TENANTS_DISTANCE', distances)
        })

        commit('SET_TENANTS', tenants)
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
  industryImg(state) {
    return state.industryImg
  },
  tenantId(state) {
    return state.tenantId
  },
  tableName(state) {
    return state.tableName
  }
}

export { state, mutations, actions, getters }
