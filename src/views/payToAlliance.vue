<template>
  <div class="pay-to-merchant-container">
    <deal-header title="向商圈付款">
    </deal-header>

    <deal-content>
      <div class="title">
        <div class="shop-icon">
          <div class="icon-wrapper">
            <i class="icon-shop"></i>
          </div>
        </div>
        <div class="shop-desc">
          向 {{merchantName}} 付款
        </div>
      </div>

      <div class="amount">
        <div class="abstract">消费金额</div>
        <div class="input-area">
          <div class="prefix">￥</div>
          <div class="content">
            <numkeyboard ref="board" v-model="num" ok-text="付款" @onOk="pay" text-align="left"></numkeyboard>
          </div>
        </div>
      </div>
    </deal-content>
  </div>
</template>
<script>
  import DealHeader from '@/components/DealHeader'
  import DealContent from '@/components/DealContent'

  import QRCodeInfo from '@/models/QRCodeInfo'
  import { vToast, vAlert } from '@/util/vux-wrapper'
  import { checkBrowserForPay } from '@/util/index'
  import { WEIXIN_BROWSER } from '@/util/constants'

  export default {
    name: 'PayToAlliance',
    data() {
      return {
        num: '',
        merchantName: ''
      }
    },
    components: {
      DealHeader,
      DealContent,
    },
    methods: {
      pay(value) {
        if (String(value).split(/\./).length > 2) {
          this.num = ''
          return vToast({ content: '请输入正确金额' })
        }

        this._pay(parseFloat(value).toFixed(2))
      },
      _pay(amount) {
        const { browser, support } = checkBrowserForPay()

        localStorage.setItem('XIAO_V_BAO_AMOUNT_EPAY', amount)

        if (browser === WEIXIN_BROWSER) {
          if (support) {
            return this.$store.dispatch('FETCH_WECHATPAY_URL_IPAY').catch(_ => {
              vAlert({ content: '不好意思, 微信重定向地址获取失败 -_-' })
            })
          } else {
            vAlert({ content: '您的微信版本过低, 不支持支付功能, 请升级微信版本 ^_^' })
          }
        } else {
          return this.$store.dispatch('FETCH_ALIPAY_IPAY', amount).catch(_ => {
            vAlert({ content: '不好意思, 阿里支付请求参数获取失败 -_-' })
          })
        }
      }
    },
    created() {
      this.merchantName = QRCodeInfo.getPaymentMerchant()
    },
    mounted() {
      // 手动显示 keyboard
      this.$refs.board.showKeyboard = true
    }
  }
</script>
<style lang="scss" scoped>
  @import '../assets/css/main.scss';

  .pay-to-merchant-container {
  .deal-header-container {}

  .deal-content-container {
    padding: 10px;
    background-color: #eaeaea;
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
    margin-top: 20px;
    text-align: center;
  }
  }

  .amount {
    background-color: #fff;
    margin-top: 20px;
    padding: 10px;
    border-radius: 4px;

  .input-area {
    display: flex;
    justify-content: flex-start;
    align-items: center;

  .content {
    flex: 1;
    margin-left: 10px;
  }
  }
  }
  }
  }
</style>
<style lang="scss">
  .keyboard {
    height: 33vh !important;

  td {
    font-size: 1rem;
  }
  }
</style>
