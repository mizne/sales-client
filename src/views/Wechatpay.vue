<template>
  <div class="wechat-callback-container">
    <deal-header title="结账单">
      <span class="header-left" slot="left" style="width: 40px;">
        <i class="icon-back" @click="$router.push({ name: 'OrderSuccess' })"></i>
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
        this.tradeNo = data.trade_no.slice(0, -4)
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
      onBridgeReady.bind(this)()
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
  }

  .deal-footer-container {
    background-color: black;
  }
}
</style>






