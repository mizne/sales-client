import { QRCodeService } from '@/http/index'
import {
  DEAL,
  ESHOP,
  GROUP_SHOPPING,
  MULTI_ESHOP,
  FETCH_OPENID
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
  FETCH_QRCODE_INFO: ({ commit, dispatch }, qrcodeId) => {
    return QRCodeService.getQRCodeInfo(qrcodeId).then(info => {
      QRCodeInfo.setQrcodeId(qrcodeId)

      //获取商家微信openid
      if (info.bizType === FETCH_OPENID) {
        QRCodeInfo.setBizType(info.bizType)
        QRCodeInfo.setTenantId(info.tenantId)
        return info
      }

      // 点餐业务、单代售业务、群购业务
      // if (info.length === 1) {
      if (Object.prototype.toString.call(info) === '[object Object]') {
        info = [info]
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
        if (info[0].coupons) {
          QRCodeInfo.setCoupons(info[0].coupons)
          QRCodeInfo.setCouponRate(info[0].couponRate)
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
          homeImage: e.tenantInfo.homeImage,
          description: `起送价${e.startPrice}元|配送费${e.deliveryFee}元`,
          officialNews: e.tenantInfo.officialNews,
          sellCountPerMonth: generateRandom(100, 1000),
          close: !dateBetween(e.tenantInfo.startTime, e.tenantInfo.endTime),
          distance: '计算中...'
        }))

        // 获取用户地理位置 并 计算商户和用户的距离
        dispatch('FETCH_USER_POSITION').then(({ lat, lng }) => {
          Promise.all(
            info.map(e =>
              computeDistanceBetween(
                { lat, lng },
                { lat: e.tenantInfo.latitude, lng: e.tenantInfo.longitude }
              )
            )
          )
          .then((distances) => {
            commit('SET_TENANTS_DISTANCE', distances.map(e => e.distance))
          })
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
  tenantId(state) {
    return state.tenantId
  },
  tableName(state) {
    return state.tableName
  }
}

export { state, mutations, actions, getters }
