import { getBizTypeHttp, exceptionHandler } from './interceptors'
import storage from '@/util/storage'
import { DEAL, ESHOP } from '@/util/constants'

class CommentService {
  getShopComment() {
    const query = `?tenantId=${storage.get('tenantId')}`

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
    const bizType = storage.get('bizType')
    if (bizType === DEAL) {
      Object.assign(params, {
        tenantId: storage.get('tenantId')
      })
    } else if (bizType === ESHOP)  {
      Object.assign(params, {
        tenantId: storage.get('tenantId'),
        consigneeId: storage.get('consigneeId')
      })
    } else {
      console.error(`Unknown biz type: ${bizType}`)
    }
  }
}

export default new CommentService()
