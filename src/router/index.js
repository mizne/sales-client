import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/Home'
import SingleTenantHome from '@/views/SingleTenantHome'
import MultiTenantHome from '@/views/MultiTenantHome'
import IndustryHome from '@/views/IndustryHome'
import Menu from '@/views/Menu'
import AllCoupons from '@/views/AllCoupons'
import AllOrders from '@/views/AllOrders'
import ShoppingCart from '@/views/ShoppingCart'
import PhoneVerify from '@/views/PhoneVerify'
import PeopleNumber from '@/views/PeopleNumber'
import OrderSuccess from '@/views/OrderSuccess'
import OrderEnsure from '@/views/OrderEnsure'
import OrderStatus from '@/views/OrderStatus'
import AlipayCallback from '@/views/AlipayCallback'
import OrderFailed from '@/views/OrderFailed'
import ShopComment from '@/views/ShopComment'
import Nearby from '@/views/Nearby'
import Mine from '@/views/Mine'
import Alipay from '@/views/Alipay'
import FoodDetail from '@/views/FoodDetail'
import ShopCommentView from '@/views/ShopCommentView'
import Wechatpay from '@/views/Wechatpay'
import SelectCoupon from '@/views/SelectCoupon'
import FetchOpenID from '@/views/FetchOpenID'
import OrderDetail from '@/views/OrderDetail'
import OfflinePayResult from '@/views/OfflinePayResult'
import searchPage from '@/views/searchPage'
import onlineMall from '@/views/onlineMall'
import onlineMallPay from '@/views/onlineMallPay'
import queryGoodsDetail from '@/views/queryGoodsDetail'

import PayToMerchant from '@/views/PayToMerchant'
import PayToAlliance from '@/views/PayToAlliance'
import PaySuccess from '@/views/PaySuccess'
import HongBaoJie from '@/views/hongbaojie'


Vue.use(Router)

// 点餐流程
// Home(主页) => Menu(菜单) => ShoppingCart(购物车) => PhoneVerify(?验证手机号码) => PeopleNumber(?选择人数) => OrderSuccess(订单详情) => OrderEnsure(?订单确认) => (Wechat/Ali)pay(支付)

// 代售流程
// Home(主页) => Menu(菜单) => PhoneVerify(?验证手机号码) => ShoppingCart(购物车) => OrderSuccess(订单详情) => (Wechat/Ali)pay(支付)

// 优惠券流程
// Home(主页) => PhoneVerify(?验证手机号码) => Menu(菜单) => ShoppingCart(购物车) => OrderSuccess(订单详情) => (Wechat/Ali)pay(支付)
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/single-tenant-home',
    name: 'SingleTenantHome',
    component: SingleTenantHome
  },
  {
    path: '/multi-tenant-home',
    name: 'MultiTenantHome',
    component: MultiTenantHome
  },
  {
    path: '/industry-home/:name',
    name: 'IndustryHome',
    component: IndustryHome
  },
  {
    path: '/menu',
    name: 'Menu',
    component: Menu
  },
  {
    path: '/all-coupon',
    name: 'AllCoupons',
    component: AllCoupons
  },
  {
    path: '/all-order',
    name: 'AllOrders',
    component: AllOrders
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
    path: '/order-status',
    name: 'OrderStatus',
    component: OrderStatus
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
    path: '/nearby',
    name: 'Nearby',
    component: Nearby
  },
  {
    path: '/mine',
    name: 'Mine',
    component: Mine
  },
  {
    path: '/alipay',
    name: 'Alipay',
    component: Alipay
  },
  {
    path: '/shop-comment-view',
    name: 'ShopCommentView',
    component: ShopCommentView
  },
  {
    path: '/wechatpay',
    name: 'Wechatpay',
    component: Wechatpay
  },
  {
    path: '/select-coupon',
    name: 'SelectCoupon',
    component: SelectCoupon
  },
  {
    path: '/fetch-openid',
    name: 'FetchOpenID',
    component: FetchOpenID
  },
  {
    path: '/order-detail/:tradeNo',
    name: 'OrderDetail',
    component: OrderDetail
  },
  {
    path: '/pay-to-merchant',
    name: 'PayToMerchant',
    component: PayToMerchant
  },
  {
    path: '/pay-to-alliance',
    name: 'PayToAlliance',
    component: PayToAlliance
  },
  {
    path: '/pay-success',
    name: 'PaySuccess',
    component: PaySuccess
  },
  {
    path: '/offline-pay-result',
    name: 'OfflinePayResult',
    component: OfflinePayResult
  },
  {
    path: '/searchPage',
    name: 'searchPage',
    component: searchPage
  },
  {
    path: '/onlineMall',
    name: 'onlineMall',
    component: onlineMall
  },
  {
    path: '/onlineMallPay',
    name: 'onlineMallPay',
    component: onlineMallPay
  },
  {
    path: '/queryGoodsDetail',
    name: 'queryGoodsDetail',
    component: queryGoodsDetail
  },
  {
    path: '/hongbaojie',
    name: 'hongbaojie',
    component: HongBaoJie
  }
]

const router = new Router({
  mode: 'history',
  routes
})

export default router
