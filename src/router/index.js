import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/Home'
import Menu from '@/views/Menu'
import AllCoupon from '@/views/AllCoupon'
import ShoppingCart from '@/views/ShoppingCart'
import PhoneVerify from '@/views/PhoneVerify'
import PeopleNumber from '@/views/PeopleNumber'
import Ordering from '@/views/Ordering'
import OrderSuccess from '@/views/OrderSuccess'
import OrderEnsure from '@/views/OrderEnsure'
import AlipayCallback from '@/views/AlipayCallback'
import OrderFailed from '@/views/OrderFailed'
import ShopComment from '@/views/ShopComment'
import VIPCard from '@/views/VIPCard'
import Alipay from '@/views/Alipay'
import FoodDetail from '@/views/FoodDetail'
import ShopCommentView from '@/views/ShopCommentView'
import Wechatpay from '@/views/Wechatpay'
import CouponView from '@/views/CouponView'

Vue.use(Router)


// 点餐流程
// Home(主页) => Menu(菜单) => ShoppingCart(购物车) => PhoneVerify(?验证手机号码) => PeopleNumber(?选择人数) => Ordering(下订单) => OrderSuccess(订单详情) => OrderEnsure(?订单确认) => (Wechat/Ali)pay(支付)

// 代售流程
// Home(主页) => Menu(菜单) => PhoneVerify(?验证手机号码) => ShoppingCart(购物车) => Ordering(下订单) => OrderSuccess(订单详情) => (Wechat/Ali)pay(支付)

// 优惠券流程
// Home(主页) => PhoneVerify(?验证手机号码) => Menu(菜单) => ShoppingCart(购物车) => Ordering(下订单) => OrderSuccess(订单详情) => (Wechat/Ali)pay(支付)
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/menu',
    name: 'Menu',
    component: Menu,
  },
  {
    path: '/all-coupon',
    name: 'AllCoupon',
    component: AllCoupon
  },
  {
    path: '/food-detail',
    name: 'FoodDetail',
    component: FoodDetail
  },
  {
    path: '/shopping-cart',
    name: 'ShoppingCart',
    component: ShoppingCart
  },
  {
    path: '/phone-verify',
    name: 'PhoneVerify',
    component: PhoneVerify
  },
  {
    path: '/people-number',
    name: 'PeopleNumber',
    component: PeopleNumber
  },
  {
    path: '/ordering',
    name: 'Ordering',
    component: Ordering
  },
  {
    path: '/order-success',
    name: 'OrderSuccess',
    component: OrderSuccess
  },
  {
    path: '/order-ensure',
    name: 'OrderEnsure',
    component: OrderEnsure
  },
  {
    path: '/alipay-callback',
    name: 'AlipayCallback',
    component: AlipayCallback
  },
  {
    path: '/order-failed',
    name: 'OrderFailed',
    component: OrderFailed
  },
  {
    path: '/shop-comment',
    name: 'ShopComment',
    component: ShopComment
  },
  {
    path: '/vip-card',
    name: 'VIPCard',
    component: VIPCard
  },
  {
    path: '/alipay',
    name: 'Alipay',
    component: Alipay
  }, {
    path: '/shop-comment-view',
    name: 'ShopCommentView',
    component: ShopCommentView
  }, {
    path: '/wechatpay',
    name: 'Wechatpay',
    component: Wechatpay
  }, {
    path: '/coupon-view',
    name: 'CouponView',
    component: CouponView
  }
]

const router = new Router({
  mode: 'history',
  routes,
})

export default router

