import { DEAL, ESHOP, GROUP_SHOPPING, MULTI_ESHOP } from '@/util/constants'
import QRCodeInfo, { capital } from '@/models/QRCodeInfo'
import { BaseService } from './BaseService'

class CommentService extends BaseService {
  getShopComment() {
    const query = this._getQuery()

    return this.getBizTypeHttp()
      .get(`/comments/merchant${query}`)
      .then(merchantRatings => {
        // 按时间倒序 排列 商家评论
        merchantRatings.sort((a, b) => {
          const milliSecondsA = new Date(a.createdAt).getTime()
          const milliSecondsB = new Date(b.createdAt).getTime()
          return milliSecondsB - milliSecondsA
        })

        return merchantRatings
      })
      .catch(this.exceptionHandler('CommentService', 'getShopComment'))
  }

  _getQuery() {
    const map = {
      [DEAL]: ['tenantId'],
      [ESHOP]: ['tenantId', 'consigneeId'],
      [GROUP_SHOPPING]: ['tenantId', 'consigneeId'],
      [MULTI_ESHOP]: ['tenantId', 'consigneeId']
    }
    return this.getBizTypeQuery(map)
  }

  addShopComment(params) {
    this._addShopInfo(params)

    return this.getBizTypeHttp()
      .post(`/comments/merchant`, params)
      .catch(this.exceptionHandler('CommentService', 'addShopComment'))
  }

  addFoodComment(params) {
    this._addShopInfo(params)

    return this.getBizTypeHttp()
      .post(`/comments/food`, params)
      .catch(this.exceptionHandler('CommentService', 'addFoodComment'))
  }

  _addShopInfo(params) {
    const map = {
      [DEAL]: ['tenantId'],
      [ESHOP]: ['tenantId', 'consigneeId'],
      [GROUP_SHOPPING]: ['tenantId', 'consigneeId'],
      [MULTI_ESHOP]: ['tenantId', 'consigneeId']
    }
    
    this.addBizTypeParams(params, map)
  }
}

export default new CommentService()
