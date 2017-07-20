import { getBizTypeHttp, exceptionHandler } from './interceptors'
import { DEAL, ESHOP } from '@/util/constants'
import QRCodeInfo, { capital } from '@/models/QRCodeInfo'

class CommentService {
  getShopComment() {
    const query = `?tenantId=${QRCodeInfo.getTenantId()}`

    return getBizTypeHttp()
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
      .catch(exceptionHandler('CommentService', 'getShopComment'))
  }

  addShopComment(params) {
    this._addShopInfo(params)

    return getBizTypeHttp()
      .post(`/comments/merchant`, params)
      .catch(exceptionHandler('CommentService', 'addShopComment'))
  }

  addFoodComment(params) {
    this._addShopInfo(params)

    return getBizTypeHttp()
      .post(`/comments/food`, params)
      .catch(exceptionHandler('CommentService', 'addFoodComment'))
  }

  _addShopInfo(params) {
    if (QRCodeInfo.isDealBizType()) {
      Object.assign(params, {
        tenantId: QRCodeInfo.getTtenantId()
      })
    } else if (QRCodeInfo.isEShopBizType())  {
      Object.assign(params, {
        tenantId: QRCodeInfo.getTtenantId(),
        consigneeId: QRCodeInfo.getConsigneeId()
      })
    } else {
      console.error(`Unknown biz type: ${QRCodeInfo.getBizType()}`)
    }
  }
}

export default new CommentService()
