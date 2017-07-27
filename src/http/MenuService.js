import { DEAL, ESHOP, GROUP_SHOPPING } from '@/util/constants'
import { BaseService } from './BaseService'

class MenuService extends BaseService {
  getAllFoods() {
    const query = this._getQuery()
    return this.getBizTypeHttp()
      .get(`/menu${query}`)
      .then(menu => {
        // 按时间倒序 排列 商品评论
        menu.forEach(subMenu => {
          // TOFIX 商品下架后 后台返回null的临时解决
          subMenu.foods = subMenu.foods.filter(e => e)

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
      .catch(this.exceptionHandler('MenuService', 'getAllFoods'))
  }

  _getQuery() {
    const map = {
      [DEAL]: ['tenantId'],
      [ESHOP]: ['tenantId', 'consigneeId'],
      [GROUP_SHOPPING]: ['tenantId', 'consigneeId']
    }
    
    return this.getBizTypeQuery(map)
  }
}

export default new MenuService()
