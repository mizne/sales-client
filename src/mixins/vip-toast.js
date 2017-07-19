import { mapGetters } from 'vuex'
import storage from '@/util/storage'
import { vToast } from '@/util/vux-wrapper'

export default {
  computed: {
    ...mapGetters([
      'tempShoppingCartFoodCost',
      'shoppingCart',
      'hasClosed',
      'hasPromptAlmostVip',
      'hasPromptVip',
      'needVipToast',
      'vipAmount',
      'almostVipAmount',
      'isVip'
    ])
  },
  watch: {
    'tempShoppingCartFoodCost': function (val, oldVal) {
      if (this.needVipToast) {
        const vipAmount = this.vipAmount
        const almostVipAmount = this.almostVipAmount
        const isVip = this.isVip

        // 如果不是vip 且 没有提示快满会员提醒 且 临时购物车的消费和购物车的消费总和 达到快满会员提示阈值
        if (!isVip && !this.hasPromptAlmostVip && (val + this.shoppingCart.totalPrice) > almostVipAmount) {
          this.$store.commit('SET_HAS_PROMPT_ALMOST_VIP', true)

          vToast({
            content: `还差${(vipAmount - val - this.shoppingCart.totalPrice).toFixed(2)}元\n可成为会员 ^_^`
          })
        }

        // 如果不是vip 且 没有提示满会员提醒 且 临时购物车的消费和购物车的消费总和 达到满会员提示阈值
        if (!isVip && !this.hasPromptVip && (val + this.shoppingCart.totalPrice) >= vipAmount) {
          this.$store.commit('SET_HAS_PROMPT_VIP', true)

          vToast({
            content: `消费已满${vipAmount}元, 结账后可晋升为会员`
          })
        }
      }
    },
  },
  created() {
    this.promptText = this.needVipToast ? 
    `满${this.vipAmount}元立可成为会员哦, 亲 ^_^`
    : '最新公告'
  }
}