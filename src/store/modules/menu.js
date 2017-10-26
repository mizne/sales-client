import { generateMutations, generateGetters } from '@/store/helper.js'
import { MenuService } from '@/http/index'
import { dateBetween } from '@/util/index'
import { vAlert } from '@/util/vux-wrapper'
import Vue from 'vue'
import QRCodeInfo from '@/models/QRCodeInfo'

const mutationMaps = [
  {
    mutationKey: 'SET_SHOW_MODE',
    stateKey: 'showMode', // Menu.vue 菜单显示模式 有图/无图
    initValue: 'picMode'
  },
  {
    mutationKey: 'SET_HAS_PROMPT_ALMOST_VIP',
    stateKey: 'hasPromptAlmostVip', // Menu.vue 是否已经 提示 消费快满会员
    initValue: false
  },
  {
    mutationKey: 'SET_HAS_PROMPT_VIP',
    stateKey: 'hasPromptVip', // Menu.vue 是否已经 提示 消费满会员
    initValue: false
  }
]

const gettersSeed = [...mutationMaps.map(e => e.stateKey)]

const stateSeed = mutationMaps.reduce((accu, curr) => {
  accu[curr.stateKey] = curr.initValue
  return accu
}, {})

const state = {
  ...stateSeed,
  foodDetail: null,
  // {
  //   [tenantId]: {
  //     [foodId]: {
  //       num: 1,
  //       remark: ''
  //     }
  //   },
  //   ...
  // }
  tempShoppingCart: {}, // 临时购物车
  // {
  //   [tenantId]: Foods,
  //   ...
  // }
  allFoods: {}, // 所有食物
  hasPromptCustomerToBuyShop: false
}

const mutations = {
  ...generateMutations(mutationMaps, state),
  SET_ALL_FOODS(state, foods) {
    const tenantId = QRCodeInfo.getTenantId()
    Vue.set(state.allFoods, tenantId, foods)
  },
  SET_FOOD_DETAIL(state, { food, typeIndex }) {
    state.foodDetail = { food, typeIndex }
  },
  ADD_FOOD(state, { food, num = 1, remark = '', typeIndex }) {
    const tenantId = QRCodeInfo.getTenantId()
    if (!state.tempShoppingCart[tenantId]) {
      Vue.set(state.tempShoppingCart, tenantId, {})
    }

    // 临时购物车 food 数量加一
    if (state.tempShoppingCart[tenantId][food.id]) {
      if (state.tempShoppingCart[tenantId][food.id].num >= food.rest) {
        return vAlert({
          content: '库存不够了哦 ^_^'
        })
      }

      if (
        food.unit === '份'
        || food.unit === '条'
        || food.unit === '瓶'
        || food.unit === '个'
        || food.unit === '盒'
        || food.unit === '块'
        || food.unit === '桶'
        || food.unit === '束'
        || food.unit === '篮'
        || food.unit === '根'
        || item.unit === '套'
        || item.unit === '罐'
        || item.unit === '件'
        || item.unit === '对'
        || item.unit === '袋'
      ) {
        state.tempShoppingCart[tenantId][food.id].num += 1
        state.tempShoppingCart[tenantId][food.id].remark = remark
      } else if (food.unit === '斤') {
        state.tempShoppingCart[tenantId][food.id].num = num
        state.tempShoppingCart[tenantId][food.id].remark = remark
      }

      if (
        !state.hasPromptCustomerToBuyShop &&
        state.tempShoppingCart[tenantId][food.id].num > 10
      ) {
        state.hasPromptCustomerToBuyShop = true
        Vue.$vux.alert.show({
          title: '恭喜',
          content: '客官, 您这是要买下小店呐 ^_^',
          buttonText: '朕就是任性'
        })
      }
    } else {
      Vue.set(state.tempShoppingCart[tenantId], food.id, { num, remark })
    }
  },
  REMOVE_FOOD(state, { food, num = 1, typeIndex }) {
    const tenantId = QRCodeInfo.getTenantId()
    // 临时购物车 food 数量减一
    if (state.tempShoppingCart[tenantId][food.id]) {
      state.tempShoppingCart[tenantId][food.id].num -= 1
      if (state.tempShoppingCart[tenantId][food.id].num === 0) {
        Vue.delete(state.tempShoppingCart[tenantId], food.id)
      }
    }
  },
  RESET_TEMP_SHOPPING_CART(state) {
    const tenantId = QRCodeInfo.getTenantId()
    Vue.delete(state.tempShoppingCart, tenantId)
  }
}

const actions = {
  FETCH_ALL_FOODS: ({ commit, state }) => {
    // if (state.allFoods.length === 0) {
    commit('SHOW_LOADING', true)

    return MenuService.getAllFoods()
      .then(data => {
        commit('SHOW_LOADING', false)
        commit('SET_ALL_FOODS', data)
      })
      .catch(err => {
        commit('SHOW_LOADING', false)
        return Promise.reject(err)
      })
    // } else {
    //   return Promise.resolve(state.allFoods)
    // }
  },
  ADD_FOOD: ({ commit }, { food, num, remark, typeIndex }) => {
    commit('ADD_FOOD', { food, num, remark, typeIndex })
  },
  REMOVE_FOOD: ({ commit }, { food, num, remark, typeIndex }) => {
    commit('REMOVE_FOOD', { food, num, remark, typeIndex })
  }
}

const getters = {
  ...generateGetters(gettersSeed, state),
  tempShoppingCart(state, getters) {
    return state.tempShoppingCart[getters.tenantId] || {}
  },
  foodDetail(state) {
    return state.foodDetail
  },
  tempShoppingCartFoodCount(state, getters) {
    return Object.keys(getters.tempShoppingCart).reduce((accu, curr) => {
      return accu + getters.tempShoppingCart[curr].num
    }, 0)
  },

  tempShoppingCartFoodCost(state, getters) {
    let total = 0

    Object.keys(getters.tempShoppingCart).forEach(foodId => {
      for (let type of getters.allFoods) {
        for (let food of type.foods) {
          if (food.id === Number(foodId)) {
            const temp =
              food.price * getters.tempShoppingCart[foodId].num
            total += Math.round(temp * 100) / 100
          }
        }
      }
    })

    return Number(total.toFixed(2))
  },
  tenantAllFoods(state, getters) {
    return state.allFoods[getters.tenantId] || []
  },

  allFoods(state, getters) {
    // 确定 allFoods 里 临时购物车里选中食物的 types
      for (let typeFoods of getters.tenantAllFoods) {
        typeFoods.selectFoodCount = 0

        Object.keys(getters.tempShoppingCart).forEach(e => {
          if (typeFoods.foods.find(food => food.id === Number(e))) {
            typeFoods.selectFoodCount += getters.tempShoppingCart[e].num
          }
        })
      }

      return getters.tenantAllFoods
  }
}

export { state, mutations, actions, getters }
