<template>
  <div class="alipay-callback-container">
    <deal-header title="结账单">
      <span class="header-left" slot="left" style="width: 40px;">
        <i class="icon-back" @click="$router.push({name: 'Menu'})"></i>
      </span>
    </deal-header>
  
    <deal-content>
      <div class="bill-content" v-if="orderDetail">
        <div class="bill-header">
          <div class="bill-inner-header">
            <div class="block"></div>
          </div>
        </div>
  
        <div class="bill-detail">
          <div class="tenant-name">{{tenantName}}</div>
          <div class="bill-abstract">
            <div class="table-info">
              <div class="table-number">
                <span>桌号：</span>
                <span>{{orderDetail.tableName}}</span>
              </div>
              <div class="people-number">
                <span>人数：</span>
                <span>{{orderDetail.diners_num}}人</span>
              </div>
            </div>
  
            <div class="ordering-time">
              <span>下单时间：</span>
              <span>{{orderDetail.time | time}}</span>
            </div>
            <div class="pay-time">
              <span>支付时间：</span>
              <span>{{payTime | time}}</span>
            </div>
          </div>
  
          <div class="money-info">
            <div class="bill-money">
              <span>账单金额{{isVip ? '(会员价)' : ''}}：</span>
              <span class="text">{{isVip ? orderDetail.totalVipPrice : orderDetail.totalPrice}}</span>
            </div>
            <div class="bill-mode">
              <span>支付宝：</span>
              <span class="text">{{isVip ? orderDetail.totalVipPrice : orderDetail.totalPrice}}</span>
            </div>
          </div>
  
          <div class="order-detail">
            <div class="order-title">
              <span>账单详情</span>
            </div>
            <div class="order-item" v-for="item in orderDetail.foods" :key="item.$index">
              <span>{{item.name}}</span>
              <span>x {{item.num}}</span>
              <span>{{isVip ? item.vipPrice : item.price}}元/{{item.unit}}</span>
            </div>
  
            <div class="coupon-info" v-if="orderDetail.couponValue">
              <span>已使用优惠券: {{orderDetail.couponValue | couponValue(orderDetail.couponType)}} </span>
            </div>

            <div class="delivery-info" v-if="orderDetail.deliveryFee">
              <span>配送费:</span> 
              <span>{{orderDetail.deliveryFee}} 元</span>
            </div>
  
            <div class="order-total">
              <span>总计</span>
              <span>{{isVip ? orderDetail.totalVipPrice : orderDetail.totalPrice}}元</span>
            </div>
          </div>
  
          <div class="welcome">
            <span>谢谢光临</span>
          </div>
        </div>
      </div>
    </deal-content>
  
    <deal-footer>
      <bill-bar @to-shopcomment="toShopComment"></bill-bar>
    </deal-footer>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'
import DealFooter from '@/components/DealFooter'
import BillBar from '@/components/BillBar'

import { objFrom } from '@/util/index'
import { vAlert } from '@/util/vux-wrapper'
import Coupon from '@/models/Coupon'

export default {
  name: 'AlipayCallback',
  components: {
    DealHeader,
    DealContent,
    DealFooter,
    BillBar
  },
  computed: {
    ...mapGetters(['orderDetail', 'tenantName', 'isVip'])
  },
  filters: {
    // 格式化后台返回下单时间 只显示时间部分
    time(v) {
      return v && v.split(' ')[1]
    },
    couponValue(v, type) {
      return new Coupon(type, v).getText()
    }
  },
  data() {
    return {
      payTime: '',
    }
  },
  methods: {
    toShopComment() {
      this.$router.push({ name: 'ShopComment' })
    }
  },
  created() {
    // 由于 Alipay 回调重新拉起应用, 故需 重新初始化状态
    const obj = objFrom(decodeURIComponent(location.search))
    this.payTime = obj.timestamp

    this.$store.dispatch('FETCH_TENANT_CONFIG')
      .then(_ => {
        document.title = this.tenantName
      })

    this.$store.dispatch('FETCH_ORDER', obj.out_trade_no)
      .catch(err => {
        vAlert({
          content: '获取订单失败 -_-',
        })
      })
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.alipay-callback-container {
  background-color: $greyBackground;
  .deal-header-container {}

  .deal-content-container {
    padding: 10px;
    height: 100vh;
    background-color: $greyBackground;

    .bill-content {
      @include flexboxCenter;
      flex-direction: column;
      margin-top: 10px;
      background-color: $greyBackground;
      color: #888;
      .bill-header {
        @include flexboxCenter;
        width: 90%;
        height: 30px;
        background-color: white;
        border-radius: 35px;

        .bill-inner-header {
          @include flexboxCenter;
          width: 90%;
          height: 15px;
          background-color: #96a596;
          border-radius: 35px;

          .block {
            width: 95%;
            height: 3px;
            background-color: #000;
          }
        }
      }

      .bill-detail {
        background-color: white;
        width: 80%;

        .tenant-name {
          @include flexboxCenter;
          height: 60px;
          font-size: 1.3rem;
        }

        .bill-abstract {
          padding: 0 10px;
          font-size: 1.1rem;
          padding-bottom: 20px;
          border-bottom: 1px solid $greyText;
          .table-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 30px;
          }

          .ordering-time,
          .pay-time {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 30px;
          }
        }

        .money-info {
          padding: 0 10px;
          border-bottom: 1px solid $greyText;
          .bill-money,
          .bill-mode {
            height: 40px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
          }

          .bill-money {
            .text {
              color: $primaryColor;
            }
          }
        }

        .order-detail {
          padding: 0 10px;
          .order-title,
          .order-item,
          .order-total {
            height: 50px;
            display: flex;
            border-bottom: 1px solid $greyText;
            align-items: center;
          }

          .order-title {
            justify-content: flex-start;
          }

          .coupon-info,
          .delivery-info {
            display: flex;
            justify-content: space-between;
            height: 50px;
            align-items: center;
            border-bottom: 1px solid #999;
          }

          .order-item {
            justify-content: space-between;
          }

          .order-total {
            justify-content: space-between;
          }
        }

        .welcome {
          @include flexboxCenter;
          height: 80px;
          font-size: 2rem;
        }
      }
    }
  }

  .deal-footer-container {
    background-color: black;
  }
}
</style>


