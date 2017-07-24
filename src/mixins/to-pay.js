import { mapGetters } from 'vuex'
import { vToast, vAlert } from '@/util/vux-wrapper'
import { checkBrowserForPay } from '@/util/index'
import { WEIXIN_BROWSER } from '@/util/constants'

export default {
  computed: {
    ...mapGetters(['selectedCoupon'])
  },
  methods: {
    payImmediately() {
      // 判断是否有用优惠券
      // 用了优惠券 则请求绑定优惠券和订单 再支付
      // 没用优惠券 则置空

      this.$store
        .dispatch('COUSUM_COUPON')
        .catch(_ => vToast({ content: '使用优惠券失败' }))
        .then(_ => {
          this._toPay()
        })
    },

    _toPay() {
      const { browser, support } = checkBrowserForPay()

      if (browser === WEIXIN_BROWSER) {
        if (support) {
          return this.$store.dispatch('FETCH_WECHATPAY_URL').catch(_ => {
            vAlert({ content: '不好意思, 微信重定向地址获取失败 -_-' })
          })
        } else {
          vAlert({ content: '您的微信版本过低, 不支持支付功能, 请升级微信版本 ^_^' })
        }
      } else {
        return this.$store.dispatch('FETCH_ALIPAY_URL').catch(_ => {
          vAlert({ content: '不好意思, 阿里支付请求参数获取失败 -_-' })
        })
      }
    }
  }
}
