<template>
  <div class="pay-success-container">
    <deal-header title="支付结果">
    </deal-header>

    <deal-content v-if="payEnd">
      <div class="title">
        <div class="shop-icon">
          <div class="icon-wrapper">
            <i class="icon-right"></i>
          </div>
        </div>
        <div class="shop-desc">
          支付成功
        </div>

        <div class="amount">
          <span class="sign">￥</span>
          <span class="number">{{totalAmount}}</span>
        </div>

        <div class="order">
          <span class="sign">订单后四位</span>
          <span class="number">{{tradeNoLastFour}}</span>
        </div>

        <div class="btn-div">
          <div class="btn-label">关注公众号 优惠多多</div>
          <div class="btn-wrapper">
            <x-button type="default" @click.native="toAttention">一键关注</x-button>
          </div>
        </div>
      </div>

    </deal-content>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { XButton } from 'vux'
import fecha from 'fecha'

import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'

import { vToast } from '@/util/vux-wrapper'
import { ATTENTION_HREF } from '@/util/constants'
import { objFrom } from '@/util/index'

export default {
  name: 'PayToMerchant',
  data() {
    return {
      totalAmount: '',
      tradeNoLastFour: '',
      payParams: null, // 微信支付请求参数
      payEnd: false // 是否支付完成
    }
  },
  components: {
    DealHeader,
    DealContent,
    XButton
  },
  computed: {
    ...mapGetters(['allCoupons', 'tenantName'])
  },
  methods: {
    toAttention() {
      window.location.href = ATTENTION_HREF
    },
    initAlipayResult(obj) {
      this.totalAmount = obj.total_amount
      this.tradeNoLastFour = String(obj.trade_no).slice(-4)
    },
    payForWechat(obj) {
      const amount = localStorage.getItem('XIAO_V_BAO_AMOUNT_EPAY')
      this.$store.dispatch('FETCH_WECHATPAY_PARAMS_EPAY', {
        code: obj.code,
        amount
      })
        .then(data => {
          this.tradeNoLastFour = data.trade_no.slice(-4)
          this.totalAmount = amount
          // TODO 获取 totalAmount

          data.timeStamp = data.timestamp
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
        onBridgeReady.bind(this)()
      }
    },
    // 等待 微信浏览器注入对象WeixinJSBridge成功 且 获取支付请求参数成功 则调用支付接口
    invokePay() {
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', this.payParams,
        (res) => {
          // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            this.payEnd = true
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
  },
  created() {
    const { isAlipay, isWechat } = this.$browser

    const obj = objFrom(decodeURIComponent(location.search))

    if (isAlipay) {
      this.payEnd = true
      this.initAlipayResult(obj)
    }

    if (isWechat) {

      this.payForWechat(obj)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.pay-success-container {
  .deal-header-container {}

  .deal-content-container {
    padding: 10px;
    background-color: $greyBackground;
    height: 100vh;

    .title {
      margin-top: 20px;
      .shop-icon {
        @include flexboxCenter;

        .icon-wrapper {
          @include flexboxCenter;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #2b91e2;
          i {
            color: #fff;
            font-size: 1.3rem;
          }
        }
      }

      .shop-desc {
        color: #2b91e2;
        margin-top: 20px;
        text-align: center;
      }

      .amount {
        @include flexboxCenter;
        .number {
          font-size: 2rem;
        }
      }

      .order {
        @include flexboxCenter;
        color: $greyText;
        .number {
          margin-left: 10px;
        }
      }

      .btn-div {
        @include flexboxCenter;
        margin-top: 20px;
        flex-direction: column;
        .btn-label {
          color: $greyText;
          margin-bottom: 10px;
        }

        button {
          width: 100px;
          color: #2b91e2;
        }
      }
    }
  }
}
</style>


