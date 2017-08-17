import { DEAL, ESHOP, GROUP_SHOPPING, MULTI_ESHOP } from '@/util/constants'
import { BaseService } from './BaseService'

class MenuService extends BaseService {
  getAllFoods() {
    const query = this._getQuery()
    return this.getBizTypeHttp()
      .get(`/menu${query}`)
      .then(menu => {
        // 过滤食物为空的subMenu
        menu = menu.filter(subMenu => subMenu.foods.length > 0)

        // 按时间倒序 排列 商品评论
        menu.forEach(subMenu => {
          subMenu.foods.forEach((food, i) => {
            food.Ratings.sort((a, b) => {
              const milliSecondsA = new Date(a.rateTime).getTime()
              const milliSecondsB = new Date(b.rateTime).getTime()
              return milliSecondsB - milliSecondsA
            })

            // 处理 image 为数组字符串格式 表示多个图片
            try {
               food.image = JSON.parse(food.image) 
            } catch(e) {
              food.image = [food.image]
            }
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
      [GROUP_SHOPPING]: ['tenantId', 'consigneeId'],
      [MULTI_ESHOP]: ['tenantId', 'consigneeId']
    }
    
    return this.getBizTypeQuery(map)
  }
}

export default new MenuService()
