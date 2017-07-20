import { getBizTypeHttp, exceptionHandler } from './interceptors'
import QRCodeInfo, { capital } from '@/models/QRCodeInfo'

class MenuService {
  getAllFoods() {
    const query = this._getQuery()

    return getBizTypeHttp()
      .get(`/menu${query}`)
      .then(menu => {
        // 按时间倒序 排列 商品评论
        menu.forEach(subMenu => {
          subMenu.foods.forEach((food, i) => {
            food.Ratings.sort((a, b) => {
              const milliSecondsA = new Date(a.rateTime).getTime()
              const milliSecondsB = new Date(b.rateTime).getTime()
              return milliSecondsB - milliSecondsA
            })
          })
        })

        return menu
      })
      .catch(exceptionHandler('MenuService', 'getAllFoods'))
  }

  _getQuery() {
    const keys =
      QRCodeInfo.isDealBizType()
        ? ['tenantId']
        : ['tenantId', 'consigneeId']

    const query =
      `?` +
      keys.map(key => `${key}=${QRCodeInfo['get' + capital(key)]()}`).join('&')

    return query
  }
}

export default new MenuService()
