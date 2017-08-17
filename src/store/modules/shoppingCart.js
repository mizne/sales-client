import Vue from 'vue'

import { ShoppingCartService } from '@/http/index'
import router from '@/router/index'
import QRCodeInfo from '@/models/QRCodeInfo'
import { vAlert } from '@/util/vux-wrapper'


const state = {
  // {
  //   [tenantId]: ShoppingCart,
  //   ...
  // }
  shoppingCart: {},
  isAddMoreFood: false
}

const mutations = {
  ADD_MORE_FOOD(state) {
    state.isAddMoreFood = true
  },
  SET_SHOPPING_CART(state, shoppingCart) {
    const tenantId = QRCodeInfo.getTenantId()
    Vue.set(state.shoppingCart, tenantId, shoppingCart)
  },
  RESET_SHOPPING_CART(state) {
    const tenantId = QRCodeInfo.getTenantId()
    Vue.set(state.shoppingCart, tenantId, {
      foods: [],
      tableName: '',
      totalNum: 0,
      totalPrice: 0,
      totalVipPrice: 0
    })
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
    const tenantId = QRCodeInfo.getTenantId()

    if (rootState.menu.tempShoppingCart[tenantId]) {
      const foodArray = Object.keys(
        rootState.menu.tempShoppingCart[tenantId]
      ).map(foodId => {
        return {
          foodId: Number(foodId),
          foodCount: rootState.menu.tempShoppingCart[tenantId][foodId].num,
          foodRemark: rootState.menu.tempShoppingCart[tenantId][foodId].remark
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
    } else {
      commit('SHOW_LOADING', false)
      router.push({ name: 'ShoppingCart' })
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

    return ShoppingCartService.editShoppingCart(foodParams)
    .then(_ => {
      commit('SHOW_LOADING', false)
      dispatch('FETCH_SHOPPING_CART')
    })
    .catch(err => {
      commit('SHOW_LOADING', false)
      dispatch('FETCH_SHOPPING_CART')
      vAlert({ content: err.message || '修改购物车失败 -_-' })
    })
  }
}

const getters = {
  shoppingCart(state, getters) {
    return (
      state.shoppingCart[getters.tenantId] || {
        foods: [],
        tableName: '',
        totalNum: 0,
        totalPrice: 0,
        totalVipPrice: 0
      }
    )
  },
  isAddMoreFood(state) {
    return state.isAddMoreFood
  }
}

export { state, mutations, actions, getters }
