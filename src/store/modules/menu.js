import { generateMutations, generateGetters } from '@/store/helper.js'
import { MenuService } from '@/http/index'
import { dateBetween } from '@/util/index'
import Vue from 'vue'

const mutationMaps = [
  {
    mutationKey: 'SET_FOOD_DETAIL',
    stateKey: 'foodDetail', // 选中的食物详情
    initValue: null
  },
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

const gettersSeed = [...mutationMaps.map(e => e.stateKey), 'tempShoppingCart']

const stateSeed = mutationMaps.reduce((accu, curr) => {
  accu[curr.stateKey] = curr.initValue
  return accu
}, {})

const state = {
  ...stateSeed,
  tempShoppingCart: {}, // 临时购物车
  allFoods: [], // 所有食物
  hasPromptCustomerToBuyShop: false
}

const mutations = {
  ...generateMutations(mutationMaps, state),
  SET_ALL_FOODS(state, foods) {
    // TOFIX 去除foods中的null
    foods.forEach(e => {
      e.foods = e.foods.filter(f => f)
    })
    state.allFoods = foods
  },
  ADD_FOOD(state, { food, num = 1, remark = '', typeIndex }) {
    // 临时购物车 food 数量加一
    if (state.tempShoppingCart[food.id]) {
      if (food.unit === '份' ||  food.unit === '条' || food.unit === '瓶' || food.unit === '个' || food.unit === '盒' || food.unit === '块' || food.unit === '桶') {
        state.tempShoppingCart[food.id].num += 1
        state.tempShoppingCart[food.id].remark = remark
      } else if (food.unit === '斤') {
        state.tempShoppingCart[food.id].num = num
        state.tempShoppingCart[food.id].remark = remark
      }

      if (
        !state.hasPromptCustomerToBuyShop &&
        state.tempShoppingCart[food.id].num > 10
      ) {
        state.hasPromptCustomerToBuyShop = true
        Vue.$vux.alert.show({
          title: '恭喜',
          content: '客官, 您这是要买下小店呐 ^_^',
          buttonText: '朕就是任性'
        })
      }
    } else {
      Vue.set(state.tempShoppingCart, food.id, { num, remark })
    }
  },
  REMOVE_FOOD(state, { food, num = 1, typeIndex }) {
    // 临时购物车 food 数量减一
    if (state.tempShoppingCart[food.id]) {
      state.tempShoppingCart[food.id].num -= 1
      if (state.tempShoppingCart[food.id].num === 0) {
        Vue.delete(state.tempShoppingCart, food.id)
      }
    }
  },
  RESET_TEMP_SHOPPING_CART(state) {
    state.tempShoppingCart = {}
  }
}

const actions = {
  FETCH_ALL_FOODS: ({ commit, state }) => {
    if (state.allFoods.length === 0) {
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
    } else {
      return Promise.resolve(state.allFoods)
    }
  },
  ADD_FOOD: ({ commit }, { food, num, remark, typeIndex }) => {
    commit('ADD_FOOD', { food, num, remark, typeIndex })
  },
  REMOVE_FOOD: ({ commit }, { food, num, remark, typeIndex }) => {
    commit('REMOVE_FOOD', { food, num, remark, typeIndex })
  },
}

const getters = {
  ...generateGetters(gettersSeed, state),

  tempShoppingCartFoodCount(state) {
    return Object.keys(state.tempShoppingCart).reduce((accu, curr) => {
      return accu + state.tempShoppingCart[curr].num
    }, 0)
  },

  tempShoppingCartFoodCost(state) {
    let total = 0

    Object.keys(state.tempShoppingCart).forEach(foodId => {
      for (let type of state.allFoods) {
        for (let food of type.foods) {
          if (food.id === Number(foodId)) {
            const temp = food.price * state.tempShoppingCart[foodId].num
            total += Math.round(temp * 100) / 100
          }
        }
      }
    })

    return total
  },

  allFoods(state) {
    // 确定 allFoods 里 临时购物车里选中食物的 types
    for (let typeFoods of state.allFoods) {
      typeFoods.selectFoodCount = 0

      Object.keys(state.tempShoppingCart).forEach(e => {
        if (typeFoods.foods.find(food => food.id === Number(e))) {
          typeFoods.selectFoodCount += state.tempShoppingCart[e].num
        }
      })
    }

    return state.allFoods
  }
}

export { state, mutations, actions, getters }
