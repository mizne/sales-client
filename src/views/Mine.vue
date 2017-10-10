<template>
  <div class="vip-card-container">
    <deal-header title="会员中心">
    </deal-header>

    <deal-content>
      <div class="phone-info">
        <span class="label">手机号</span>
        <span class="number">{{phoneNumber}}</span>
      </div>

      <div class="card-detail">
        <div class="abstract-top">
          <div class="check-in">
            <span class="day">0天</span>
            <div class="18 calendar" style="display:inline-block">
              <i style="color:#08BDD8" class="icon-18calendar"></i>
            </div>
            <span class="text">签到</span>
          </div>

          <div class="dividing-line"></div>

          <div class="points" @click="toPoints()">
            <span class="number">{{integral}} 积分</span>
            <div class="integral" >
              <i  class="icon-integral"></i>
            </div>
            <span class="text">我的积分</span>
          </div>
        </div>

        <div class="abstract">

          <div class="gift" @click="toCoupon()">
            <i class="icon-gift"></i>
            <span class="text">我的券包</span>
          </div>

          <div class="order" @click="toOrder()">
            <i class="icon-order1"></i>
            <span class="text">我的订单</span>
          </div>


          <div class="cart">
            <i class="icon-iconfontcart" @click="toMall()"></i>
            <span class="text">在线商城</span>
          </div>
        </div>

        <div class="abstract-line">

          <div class="cart">
            <i class="icon-iconfontcart"></i>
            <span class="text">积分兑换</span>
          </div>

          <div class="my">
            <i class="icon-my"></i>
            <span class="text">我的资料</span>
          </div>


          <div class="comment">
            <i class="icon-comment"></i>
            <span class="text">通知消息</span>
          </div>
        </div>

        <!-- <div class="card-item points">
              <i class="icon-points"></i>
              <span class="text">积分换券</span>
              <i class="icon-forward"></i>
            </div>
            <div class="card-item user">
              <i class="icon-user"></i>
              <span class="text">个人资料</span>
              <i class="icon-forward"></i>
            </div>
            <div class="card-item shops">
              <i class="icon-shop"></i>
              <span class="text">使用门店</span>
              <i class="icon-forward"></i>
            </div> -->
      </div>
    </deal-content>

    <deal-footer v-if="hasTabs">
      <tabs>
      </tabs>
    </deal-footer>

  </div>
</template>
<script>
import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'
import DealFooter from '@/components/DealFooter'
import DealDialog from '@/components/DealDialog'
import Tabs from '@/components/Tabs'
import axios from 'axios'

import QRCodeInfo from '@/models/QRCodeInfo'
import { vAlert, vConfirm } from '@/util/vux-wrapper'
import router from '@/router/index'
import store from '@/store/index'
import { VERIFY_USER } from '@/store/modules/phoneVerify'

export default {
  name: 'OrderSuccess',
  components: {
    DealHeader,
    DealContent,
    DealFooter,
    DealDialog,
    Tabs
  },
  data() {
    return {
      hasTabs: false,
      phoneNumber: '',
      integral: ''
    }
  },
  created() {

  },
  methods: {
    toPoints() {
      // this.$router.push({ name: 'OrderStatus' })
    },
    toCoupon() {
      this.$router.push({ name: 'AllCoupons' })
    },
    toOrder() {
      this.$router.push({ name: 'AllOrders' })
    },
    toMall() {
      this.$router.push({ name: 'onlineMall' })
    }
  },
  created() {
    this.$store.commit('SET_TAB_INDEX', 3)
    this.phoneNumber = QRCodeInfo.getPhoneNumber()
    this.hasTabs = QRCodeInfo.isMultiEShopBizType()
    axios.get(`https://deal.xiaovbao.cn/api/test/admin/vipPhone?alliancesId=222267370d07487ee160a1b7c07136e4&number=${this.phoneNumber}`).then(resp => {
       this.integral = resp.data.result.aggregateScore
    })
  },
  beforeRouteEnter(to, from, next) {
    if (!QRCodeInfo.hasPhoneNumber()) {
      vConfirm({ content: '您还没有验证手机号码呢', confirmText: '去验证', cancelText: '不了' })
        .then(_ => {
          store.commit('SET_PURPOSE_OF_PHONE_VERIFY', VERIFY_USER)
          router.push({ name: 'PhoneVerify' })
        })
        .catch(_ => {
          next(false)
        })
    } else {
      next()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.vip-card-container {
  height: 100vh;
  .deal-header-container {}

  .deal-content-container {
    padding: 10px;
    background-color: $greyBackground;
    bottom: 0;

    .phone-info {
      height: 50px;
      color: #aaa;
      background-color: $whiteBackground;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }

    .card-detail {
      margin-top: 10px;
      height: 230px;
      font-size:14px;

        .abstract-top {
          display: flex;
          height: 70px;
          padding-top:10px;
          padding-bottom:10px;

          background-color: $whiteBackground;
          justify-content: space-around;
          align-items: center;
          margin-bottom:10px;

        .dividing-line{
          border-right:1px solid #CCD5D2;
          width:30px;
          height:60px;
        }

        .points {
            margin-left:-10px;
          .number {
            display:block;
            text-align:center;
          }
          .integral{
              display:inline-block;
            i{
              color: $cartColor;
            }
          }
        }

        .check-in {
            margin-right:-20px;
          .day{
            display:block;
            text-align:center;
          }
          .18 calendar{
            i {
              color: $calendar;
            }
          }
        }
      }
      .abstract {
        display: flex;
        height: 90px;
        padding-top:10px;

        background-color: $whiteBackground;
        justify-content: space-around;
        align-items: center;
        border-bottom:1px solid #CCD5D2;

        .points,
        .order,
        .cart,
        .gift {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size:14px;
        }

        .points {
          .number {
            color: $primaryColor;
            transform: scale(1.5);
            margin-bottom: 15px;
          }
        }

        .order {

          i {
            background-color: $orderColor;
            color:#fff;
            width:30px;
            height:30px;
            text-align:center;
            line-height:30px;
            border-radius:15px;
            transform: scale(1.5);
            margin-bottom: 10px;
          }
        }

        .cart {
          i {
            background-color: $mallColor;
            color:#fff;
            width:30px;
            height:30px;
            text-align:center;
            line-height:30px;
            border-radius:15px;
            transform: scale(1.5);
            margin-bottom: 10px;
          }
        }

        .gift {
          i {
            background-color: $couponColor;
            color:#fff;
            width:30px;
            height:30px;
            text-align:center;
            line-height:30px;
            border-radius:15px;
            transform: scale(1.5);
            margin-bottom: 10px;
          }
        }
      }

      .abstract-line{
        display: flex;
        height: 90px;
        padding-top:10px;

        background-color: $whiteBackground;
        justify-content: space-around;
        align-items: center;
        border-bottom:1px solid #CCD5D2;

        .comment,
        .my,
        .cart,
        .points
         {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size:14px;
        }

        .points {
        .number {
          color: $primaryColor;
          transform: scale(1.5);
          margin-bottom: 15px;
        }
        }

        .my {

          i {
            background-color: $myInfo;
            color:#fff;
            width:30px;
            height:30px;
            text-align:center;
            line-height:30px;
            border-radius:15px;
            transform: scale(1.5);
            margin-bottom: 10px;
          }
        }

        .cart {
        i {
          background-color: #FFBC03;
          color:#fff;
          width:30px;
          height:30px;
          text-align:center;
          line-height:30px;
          border-radius:15px;
          transform: scale(1.5);
          margin-bottom: 10px;
        }
        }

        .comment {
        i {
          background-color: $notification;
          color:#fff;
          width:30px;
          height:30px;
          text-align:center;
          line-height:30px;
          border-radius:15px;
          transform: scale(1.5);
          margin-bottom: 10px;
        }
        }
      }

      .card-item {
        height: 50px;
        background-color: $whiteBackground;
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-top: 2px;

        i {
          transform: scale(2);
        }
      }
    }
  }
  .deal-dialog-container {
    .content {
      @include flexboxCenter;
      height: 50px;
    }

    .btn-group {
      height: 50px;
      display: flex;
      justify-content: space-around;
      align-items: center;

      .cancel,
      .ok {
        flex: 1;
        color: $primaryColor;
      }
    }
  }
}
</style>


