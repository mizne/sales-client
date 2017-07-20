import Vue from 'vue'
import Vuex from 'vuex'

import * as comment from './modules/comment'
import * as coupon from './modules/coupon'
import * as loading from './modules/loading'
import * as menu from './modules/menu'
import * as order from './modules/order'
import * as pay from './modules/pay'
import * as phoneVerify from './modules/phoneVerify'
import * as qrcode from './modules/qrcode'
import * as shoppingCart from './modules/shoppingCart'
import * as tenant from './modules/tenant'
import * as user from './modules/user'

// import plugins from './plugins'

Vue.use(Vuex)

const store = new Vuex.Store({
  // plugins,

  modules: {
    comment,
    coupon,
    loading,
    menu,
    order,
    pay,
    phoneVerify,
    qrcode,
    shoppingCart,
    tenant,
    user,
  }
})

export default store