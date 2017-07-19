import { ShoppingCartService } from '@/http/index'
import storage from '@/util/storage'
import router from '@/router/index'

const state = {
  shoppingCart: {
    foods: [],
    tableName: '',
    totalNum: 0,
    totalPrice: 0,
    totalVipPrice: 0
  },
  isAddMoreFood: false
}

const mutations = {
  ADD_MORE_FOOD(state) {
    state.isAddMoreFood = true
  },
  SET_SHOPPING_CART(state, shoppingCart) {
    state.shoppingCart = shoppingCart
  },
  RESET_SHOPPING_CART(state) {
    state.shoppingCart = {
      foods: [],
      tableName: '',
      totalNum: 0,
      totalPrice: 0,
      totalVipPrice: 0
    }
  }
}

const actions = {
  ADD_MORE_FOOD: ({ commit }) => {
    commit('ADD_MORE_FOOD')
    commit('RESET_TEMP_SHOPPING_CART')
    router.push({ name: 'Menu' })
  },
  SET_SHOPPING_CART: ({ commit }, shoppingCart) => {
    commit('SET_SHOPPING_CART', shoppingCart)
    commit('RESET_TEMP_SHOPPING_CART')
  },
  ADD_SHOPPING_CART: ({ commit, rootState }) => {
    commit('SHOW_LOADING', true)

    const foodArray = Object.keys(
      rootState.menu.tempShoppingCart
    ).map(foodId => {
      return {
        foodId: Number(foodId),
        foodCount: rootState.menu.tempShoppingCart[foodId].num,
        foodRemark: rootState.menu.tempShoppingCart[foodId].remark
      }
    })

    // 如果临时购物车有菜
    if (foodArray.length > 0) {
      const params = {
        foods: foodArray
      }

      return ShoppingCartService.addShoppingCart(params)
        .then(_ => {
          commit('SHOW_LOADING', false)
          router.push({ name: 'ShoppingCart' })
        })
        .catch(err => {
          commit('SHOW_LOADING', false)
          return Promise.reject(err)
        })
    } else {
      // 如果临时购物车没有菜(处于加菜状态)
      return Promise.resolve().then(_ => {
        commit('SHOW_LOADING', false)
        router.push({ name: 'ShoppingCart' })
      })
    }
  },
  FETCH_SHOPPING_CART: ({ commit, dispatch }) => {
    commit('SHOW_LOADING', true)

    return ShoppingCartService.getShoppingCart()
      .then(shopCart => {
        commit('SHOW_LOADING', false)
        dispatch('SET_SHOPPING_CART', shopCart)
        return shopCart
      })
      .catch(err => {
        commit('SHOW_LOADING', false)
        return Promise.reject(err)
      })
  },
  EDIT_SHOPPING_CART: ({ commit, dispatch }, foodParams) => {
    commit('SHOW_LOADING', true)

    return ShoppingCartService.editShoppingCart(foodParams).then(_ =>
      dispatch('FETCH_SHOPPING_CART')
    )
  }
}

const getters = {
  shoppingCart(state) {
    return state.shoppingCart
  },
  isAddMoreFood(state) {
    return state.isAddMoreFood
  }
}

export { state, mutations, actions, getters }
