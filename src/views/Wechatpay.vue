<template>
  <div class="wechat-callback-container">
    <deal-header title="结账单">
      <span class="header-left" slot="left" style="width: 40px;">
        <i class="icon-back" @click="$router.push({name: 'Menu'})"></i>
      </span>
    </deal-header>
  
    <deal-content>
      <bill-detail v-if="orderDetail" :order-detail="orderDetail" 
      :tenant-name="tenantName" :pay-time="payTime" pay-mode="微信"></bill-detail>
    </deal-content>
  
    <deal-footer v-if="orderDetail">
      <bill-bar @to-shopcomment="toShopComment"></bill-bar>
    </deal-footer>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import fecha from 'fecha'

import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'
import DealFooter from '@/components/DealFooter'
import BillBar from '@/components/BillBar'
import BillDetail from '@/components/BillDetail'

import { objFrom } from '@/util/index'
import { vAlert } from '@/util/vux-wrapper'
import Coupon from '@/models/Coupon'

export default {
  name: 'Wechatpay',
  components: {
    DealHeader,
    DealContent,
    DealFooter,
    BillBar,
    BillDetail
  },
  computed: {
    ...mapGetters(['orderDetail', 'tenantName']),
  },
  data() {
    return {
      payTime: '',
      payParams: null, // 请求支付参数
      tradeNo: null // 当前订单号
    }
  },

  methods: {
    // 等待 微信浏览器注入对象WeixinJSBridge成功 且 获取支付请求参数成功 则调用支付接口
    invokePay() {
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', this.payParams,
        (res) => {
          // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            this.$store.dispatch('FETCH_ORDER', this.tradeNo)
              .catch(err => {
                vAlert({
                  content: '获取订单失败 -_-',
                })
              })
          }
          if (res.err_msg === 'get_brand_wcpay_request:cancel') {
            vAlert({
              content: '支付取消',
            })
          }
          if (res.err_msg === 'get_brand_wcpay_request:fail') {
            vAlert({
              content: '支付失败 -_-',
            })
          }
        }
      )
    },
    toShopComment() {
      this.$router.push({ name: 'ShopComment' })
    }
  },
  created() {
    const obj = objFrom(decodeURIComponent(location.search))

    this.$store.dispatch('FETCH_TENANT_CONFIG')
      .then(_ => {
        document.title = this.tenantName
      })

    this.$store.dispatch('FETCH_WECHATPAY_PARAMS', obj.code)
      .then(data => {
        this.tradeNo = data.trade_no
        data.timeStamp = data.timestamp
        this.payTime = fecha.format(new Date(data.timestamp * 1000), 'YYYY-MM-DD HH:mm:ss')
        delete data.timestamp
        delete data.trade_no
        this.payParams = data

        if (typeof WeixinJSBridge !== 'undefined') {
          this.invokePay()
        }
      })
      .catch(err => {
        vAlert({
          content: '获取微信支付请求失败 -_-',
        })
      })

    function onBridgeReady() {
      if (this.payParams) {
        this.invokePay()
      }
    }

    if (typeof WeixinJSBridge == "undefined") {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady.bind(this), false)
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady.bind(this))
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady.bind(this))
      }
    } else {
      onBridgeReady()
    }

    // {
    //       "appId":"wx2421b1c4370ec43b",     //公众号名称，由商户传入
    //       "timeStamp":"1395712654",         //时间戳，自1970年以来的秒数
    //       "nonceStr":"e61463f8efa94090b1f366cccfbbb444", //随机串
    //       "package":"prepay_id=u802345jgfjsdfgsdg888",
    //       "signType":"MD5",         //微信签名方式：
    //       "paySign":"70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名
    //   	}
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.wechat-callback-container {
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
              color: $primaryColor$primaryColor;
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

          .coupon-info,
          .delivery-info {
            display: flex;
            justify-content: space-between;
            height: 50px;
            align-items: center;
            border-bottom: 1px solid #999;
          }

          .order-title {
            justify-content: flex-start;
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






