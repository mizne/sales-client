<template>
  <div class="order-success-container">
    <deal-header title="下单成功">
      <x-button slot="left" @click.native="addMoreFood" :mini="true" type="primary">继续添加</x-button>
    </deal-header>
  
    <deal-content v-if="orderDetail">
      <scroll-notification :text="promptText"></scroll-notification>
      <div class="tip">
        <div class="line">
          <i class="icon-point"></i>
          <span>若退出, 再扫二维码, 即可加菜或买单</span>
        </div>
        <div class="line" v-if="!isDealBizType">
          <div class="btn-group">
            <!--<div class="edit-btn">
                                          <x-button type="primary" @click.native="editOrder">修改</x-button>
                                        </div>-->
            <div class="cancel-btn" style="margin-left: 10px;">
              <x-button type="primary" @click.native="cancelOrder">取消</x-button>
            </div>
          </div>
          <div class="placeholder"></div>
        </div>
      </div>
      <div class="order-info">
        <div class="table-number">
          <span style="margin-left: 20px;">台
            <span style="width: 30px; display:inline-block"></span>
            号：</span>
          <span>{{orderDetail.tableName}}</span>
        </div>
        <div class="order-time">
          <span>下单时间：</span>
          <span>{{orderDetail.time | time}}</span>
        </div>
      </div>
  
      <div class="order-detail">
        <group>
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
  
        <swipeout :disabled="isDealBizType">
          <div v-for="item in orderDetail.foods" :key="item.id">
            <swipeout-item transition-mode="follow">
              <div slot="right-menu">
                <swipeout-button @click.native="deleteFood(item)" type="warn">删除</swipeout-button>
              </div>
              <div slot="content">
                <div class="order-item">
                  <div class="item-detail">
                    <div class="food-name">{{item.name}}</div>
                    <div class="food-money">
                      <div class="food-price">{{item.price}} 元/{{item.unit}}</div>
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

import storage from '@/util/storage'
import { vAlert, vConfirm, vToast } from '@/util/vux-wrapper'
import { checkBrowserForPay } from '@/util/index'
import { WEIXIN_BROWSER, ALI_BROWSER, UNKNOWN_BROWSER, DEAL } from '@/util/constants'

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
    OrderBar
  },
  computed: {
    ...mapGetters(['orderDetail', 'showIframe', 'isVip', 'couponText', 'selectedCoupon']),
    totalPrice() {
      if (this.orderDetail) {
        if (this.isVip) {
          return this.orderDetail.totalVipPrice
        } else {
          return this.orderDetail.totalPrice
        }
      }
    },
  },
  data() {
    return {
      promptText: '',
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
      this.$router.push({ name: 'CouponView' })
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
          this.$store.dispatch('CANCEL_ORDER')
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
    // 如果不需要 订单确认页面 则直接买单
    // 否则 跳到订单确认页面
    toPay() {
      // 判断是否有用优惠券
      // 用了优惠券 则请求绑定优惠券和订单 再支付
      // 没用优惠券 直接支付
      (this.selectedCoupon 
      ? this.$store.dispatch('COUSUM_COUPON').catch(err => vToast({ content: '绑定优惠券失败' }))
      : Promise.resolve('没选择优惠券'))
        .then(_ => {
          this._toPay()
        })
    },
    _toPay() {
      const { browser, support } = checkBrowserForPay()

      if (browser === WEIXIN_BROWSER) {
        if (support) {
          return this.$store.dispatch('FETCH_WECHATPAY_URL')
            .catch(_ => {
              vAlert({ content: '不好意思, 微信重定向地址获取失败 -_-' })
            })

        } else {
          vAlert({ content: '您的微信版本过低, 不支持支付功能, 请升级微信版本 ^_^' })
        }
      } else {
        return this.$store.dispatch('FETCH_ALIPAY_URL')
          .catch(_ => {
            vAlert({ content: '不好意思, 阿里支付请求参数获取失败 -_-' })
          })

      }
    },
    _init() {
      this.isDealBizType = storage.get('bizType') === DEAL

      this.promptText = this.isDealBizType
        ? '欢迎光顾小店'
        : 'e代售提醒您先买单, 订单10分钟后失效'

    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name === 'Ordering' || from.name === 'Home') {
        vm.$store.dispatch('FETCH_ORDER')
          .then(_ => {
            vm.$store.dispatch('FETCH_AVALIABLE_COUPONS')
          })
          .catch(err => {
            vAlert({ content: '获取订单失败' })
          })
      }
    })
  },
  created() {

    this._init()
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.order-success-container {
  .deal-header-container {}

  .deal-content-container {

    background-color: $greyBackground;
    overflow-x: hidden;
    overflow-y: auto;

    .tip {
      margin-top: 5px;
      .line {
        margin-top: 10px;
        font-size: 1.1rem;
        line-height: 1.5rem;
        color: $greyText;
        letter-spacing: 1px;
        display: flex;

        .btn-group,
        .placeholder {
          flex: 1;
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

      .abstract {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 50px;
        background-color: #fff;

        .total-cost {
          color: $primaryColor;
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

  .deal-footer-container {
    background-color: black;
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


