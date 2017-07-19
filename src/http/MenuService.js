import { getBizTypeHttp, exceptionHandler } from './interceptors'
import storage from '@/util/storage'
import { DEAL, ESHOP } from '@/util/constants'

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
      storage.get('bizType') === DEAL
        ? ['tenantId']
        : ['tenantId', 'consigneeId']

    const query =
      `?` +
      keys.map(key => `${key}=${storage.get(key)}`).join('&')

    return query
  }
}

export default new MenuService()
