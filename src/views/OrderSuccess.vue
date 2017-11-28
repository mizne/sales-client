<template>
  <div class="order-success-container">
    <deal-header title="下单成功">
      <!-- <x-button slot="left" @click.native="addMoreFood" :mini="true" type="primary">继续添加</x-button> -->
    </deal-header>

    <deal-content v-if="orderDetail">
      <!-- <scroll-notification :texts="promptText"></scroll-notification> -->
      <!-- <div class="tip">
            <div class="line">
              <i class="icon-point"></i>
              <span>若退出, 再扫二维码, 即可加单或买单</span>
            </div>
            <div class="line" v-if="!isDealBizType">
              <div class="btn-group">
                <div class="cancel-btn">
                  <x-button type="primary" @click.native="cancelOrder">取消</x-button>
                </div>
              </div>
              <div class="placeholder"></div>
            </div>
          </div> -->
      <div class="order-info">
        <div class="table-number" v-if="isDealBizType">
          <span style="margin-left: 20px;">台
            <span style="width: 30px; display:inline-block"></span> 号：
          </span>
          <span>{{orderDetail.tableName}}</span>
        </div>
        <div class="order-time">
          <span>下单时间：</span>
          <span>{{orderDetail.time | time}}</span>
        </div>
      </div>

      <div class="order-detail">
        <group class="coupon-area">
          <cell title="优惠券" :value="couponText" @click.native="toCoupon" :is-link="true"></cell>
        </group>
        <div class="abstract">
          <span class="text">账单详情</span>
          <span class="total-count">份数: {{orderDetail.totalNum}}</span>
          <span class="total-cost" v-if="!isVip">普通价：
            <i class="icon-money"></i>
            <span>{{orderDetail.totalPrice}}</span>
          </span>
          <span class="total-cost" v-if="isVip">会员价:
            <i class="icon-money"></i>
            <span>{{orderDetail.totalVipPrice}}</span>
          </span>
        </div>

        <swipeout>
          <div v-for="item in orderDetail.foods" :key="item.id">
            <swipeout-item transition-mode="follow" :disabled="true">
              <div slot="right-menu">
                <swipeout-button @click.native="deleteFood(item)" type="warn">删除</swipeout-button>
              </div>
              <div slot="content">
                <div class="order-item">
                  <div class="item-detail">
                    <div class="food-name">{{item.name}}</div>
                    <div class="food-money">
                      <div class="food-price">{{orderDetail.isVip ? item.vipPrice : ( item.activityPrice ? item.activityPrice : item.price )}} 元/{{item.unit}}</div>
                      <template v-if="item.unit === '份'">
                        <i v-if="isEditable" class="icon-sub" @click="editFood(item)"></i>
                        <div class="food-count">{{item.num}}</div>
                        <i v-if="isEditable" class="icon-plus" @click="editFood(item)"></i>
                      </template>
                      <template v-else>
                        <x-number style="flex: 5;" v-if="isEditable" v-model="item.num" @on-change="editFood(item)" :min="0.1" :step="0.1"></x-number>
                        <div v-else class="food-count">{{item.num}}</div>
                      </template>
                    </div>
                  </div>
                </div>
                <div class="food-remark" v-if="item.unit === '斤'" style="padding: 10px;">
                  <p>备注： {{item.remark}}</p>
                </div>
              </div>
            </swipeout-item>
          </div>
        </swipeout>

        <div class="food-remark" v-if="orderDetail.totalGoodsDiscount" style="padding: 10px;">
          <p>活动优惠：
            <span><i class="icon-money"></i>
            <span>{{orderDetail.totalGoodsDiscount}}</span></span>
          </p>
        </div>

        <delivery v-if="needDeliveryFee" :delivery-distance="deliveryDistance" :delivery-fee-value="deliveryFeeValue" :delivery-time="deliveryTime"></delivery>

      </div>
    </deal-content>

    <deal-footer>
      <order-bar :order-cost="totalPrice" @to-pay="toPay"></order-bar>
    </deal-footer>

    <div class="deal-mask" v-show="showIframe"></div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Swipeout, SwipeoutItem, SwipeoutButton, XButton, XNumber, Group, Cell } from 'vux'
import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'
import DealFooter from '@/components/DealFooter'
import ScrollNotification from '@/components/ScrollNotification'
import OrderBar from '@/components/OrderBar'
import Delivery from '@/components/Delivery'

import QRCodeInfo from '@/models/QRCodeInfo'
import { vAlert, vConfirm, vToast } from '@/util/vux-wrapper'
import Coupon from '@/models/Coupon'
import toPayMixin from '@/mixins/to-pay'

export default {
  name: 'OrderSuccess',
  components: {
    DealHeader,
    DealContent,
    DealFooter,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    XButton,
    XNumber,
    Group,
    Cell,
    ScrollNotification,
    OrderBar,
    Delivery
  },
  mixins: [toPayMixin],
  computed: {
    ...mapGetters([
      'orderDetail',
      'showIframe',
      'isVip',
      'avaliableCoupons',
      'selectedCoupon',
      'needDeliveryFee',
      'deliveryFeeValue',
      'deliveryDistance',
      'deliveryTime',
      'needOrderConfirmPage'
    ]),
    totalPrice() {
      if (this.orderDetail) {
        let resultPrice = 0
        let freePrice = 0

        if (this.isVip) {
          resultPrice = this.orderDetail.totalVipPrice
        } else {
          resultPrice = this.orderDetail.totalPrice
        }

        if (this.orderDetail.firstOrderDiscount) {
          resultPrice -= this.orderDetail.firstOrderDiscount
        }

        if (this.selectedCoupon) {
          resultPrice = new Coupon(this.selectedCoupon.couponType, this.selectedCoupon.value).computePrice(resultPrice)
        }

        if (this.deliveryFeeValue) {
          resultPrice += (+this.deliveryFeeValue)
        }

        if (this.orderDetail.totalGoodsDiscount) {
          resultPrice -= this.orderDetail.totalGoodsDiscount
        }



        if (this.isVip) {
          freePrice = this.orderDetail.totalVipPrice - resultPrice
        } else {
          freePrice = this.orderDetail.totalPrice - resultPrice
        }

        if (this.deliveryFeeValue) {
          freePrice += (+this.deliveryFeeValue)
        }

        if (resultPrice < 0) {
          resultPrice = 0.01
        }

        if (freePrice > 0) {
          return resultPrice + `(已优惠 ${freePrice.toFixed(2)} 元)`
        }
        return String(resultPrice)
      }
    },
    couponText() {
      if (this.selectedCoupon) {
        return new Coupon(this.selectedCoupon.couponType, this.selectedCoupon.value).getText()
      } else {
        return this.avaliableCoupons.length > 0 ? `${this.avaliableCoupons.length} 张可用` : '无可用'
      }
    }
  },
  data() {
    return {
      promptText: [''],
      isEditable: false,
      isDealBizType: false
    }
  },
  filters: {
    // 格式化后台返回下单时间 只显示时间部分
    time(v) {
      return v && v.split(' ')[1]
    }
  },
  methods: {
    toCoupon() {
      if (this.orderDetail.firstOrderDiscount) {
        return vAlert({ content: '抱歉, 您已享有首杯半价优惠, 不能使用优惠券了' })
      }
      if (this.orderDetail.totalGoodsDiscount) {
        return vAlert({ content: '抱歉, 您已享有活动优惠, 不能使用优惠券了' })
      }
      this.$router.push({ name: 'SelectCoupon' })
    },
    addMoreFood() {
      this.$store.dispatch('ADD_MORE_FOOD')
    },
    editOrder() {
      this.isEditable = !this.isEditable
    },
    cancelOrder() {
      vConfirm({ content: '确定取消订单?' })
        .then(_ => {
          return this.$store.dispatch('CANCEL_ORDER')
        })
        .then(_ => {
          vToast({
            type: 'success',
            content: '取消成功'
          })
        })
    },
    deleteFood(food) {
      this.$store.dispatch('EDIT_ORDER', {
        foodId: food.id,
        foodCount: 0
      })
    },
    editFood(food) {
      this.$store.dispatch('EDIT_ORDER', {
        foodId: food.id,
        foodCount: food.num
      })
    },

    toPay() {
      vConfirm({ content: '选择支付方式', confirmText: '立即线上支付', cancelText: '退房时支付' })
      .then((_) =>　{
        // 如果不需要 订单确认页面 则直接买单
      // 否则 跳到订单确认页面
      if (this.needOrderConfirmPage) {
        this.$router.push({ name: 'OrderEnsure' })
      } else {
        this.payImmediately()
      }
      })
      .catch((_) => {
        this.$store.dispatch('OFFLINE_PAY', {
          tradeNo: this.orderDetail.tradeNo
        })
      })

    },
    init() {
      this.isDealBizType = QRCodeInfo.isDealBizType()

      this.promptText = this.isDealBizType
        ? ['欢迎光顾小店']
        : ['小v宝e代售提醒您先买单, 订单10分钟后失效']

    }
  },
  created() {
    this.init()
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // 从 所有订单列表页面 进入 通过订单号 获取订单详情
      if (from.name === 'AllOrders') {
        return vm.$store.dispatch('FETCH_ORDER', vm.$route.query.tradeNo)
          .catch(err => {
            vAlert({ content: '获取订单失败' })
          })
      }

      // 分别从
      // 购物车页面 代售业务从购物车进来 下单
      // 验证电话号码页面 点餐业务没电话号码 验证完 则下单
      // 主页 有订单情况下 则直接进入
      // 订单失败页面 下订单失败则继续下单
      if (from.name !== 'SelectCoupon') {
        vm.$store.dispatch('FETCH_ORDER')
          .catch(err => {
            vAlert({ content: '获取订单失败' })
          })
      }

      // 从支付宝支付页面 回来 去除遮罩层
      if (from.name === 'Alipay') {
        vm.$store.commit('SET_SHOW_IFRAME', false)
      }
    })
  }
}

</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.order-success-container {
  .deal-header-container {
  }

  .deal-content-container {
    background-color: $greyBackground;
    overflow-x: hidden;
    overflow-y: auto;
    margin-bottom: 50px;

    .tip {
      margin-top: 35px;
      .line {
        margin-top: 10px;
        padding: 0 10px;
        font-size: 1.1rem;
        line-height: 1.5rem;
        color: $greyText;
        letter-spacing: 1px;
        display: flex;

        .btn-group {
          flex: 1;
        }
        .placeholder {
          flex: 3;
        }

        .btn-group {
          display: flex;
          .edit-btn,
          .cancel-btn {
            flex: 1;
          }
        }
      }
    }

    .order-info {
      @include flexboxCenter;
      height: 40px;
      margin: 10px 10px 0 10px;
      color: $greyText;
      background-color: #fff;
      border-radius: 5px;

      .table-number,
      .order-time {
        @include flexboxCenter;
        flex: 1;
      }

      .table-number {
        display: flex;
        justify-content: flex-start;
      }
    }

    .order-detail {
      margin: 10px 10px 0 10px;
      color: #888;

      .coupon-area {
        // color: $warnColor;
      }

      .abstract {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 50px;
        background-color: #fff;
        color: #777;

        .total-cost {
          // color: $primaryColor;
        }
      }

      .order-item {
        margin-top: 2px;
        height: 100px;
        background-color: #fff;
        height: 60px;
        display: flex;
        padding: 10px;
        background-color: #fff;
        border-radius: 5px;

        .item-detail {
          flex: 4;
          padding: 0 10px;

          .food-name {
            text-align: left;
          }

          .food-money {
            display: flex;
            margin-top: 14px;
            color: #c1d0be;
            height: 27px;

            .food-price {
              flex: 3;
            }
            .food-count {
              @include flexboxCenter;
              flex: 1;
            }

            .food-price {
              text-align: left;
            }

            i {
              @include flexboxCenter;
              flex: 2;
              color: $primaryColor;
              font-size: 1.3rem;
            }
          }
        }
      }
    }
  }

  iframe {
    border: none;
    width: 100%;
    height: 80%;
    position: fixed;
    bottom: 0;
    transform: translateX(-50%);
    z-index: 2000;
  }

  .deal-mask {
    position: fixed;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1000;
  }
}
</style>
<style lang="scss">
@import '../assets/css/main.scss';
.coupon-area {
  .weui-cell__ft {
    // background-color: $warnColor;
    font-weight: bold;
  }
}
</style>
