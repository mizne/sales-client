import { mapGetters } from 'vuex'
import { vAlert, vToast } from '@/util/vux-wrapper'
import { ADD_ORDER } from '@/store/modules/phoneVerify'
import QRCodeInfo, { capital } from '@/models/QRCodeInfo'

export default {
  computed: {
    ...mapGetters(['shoppingCart', 'needChoosePeopleNumberPage'])
  },
  methods: {
    ensureOrder() {
      if (this.shoppingCart.foods.length === 0) {
        return vAlert({ content: '购物车为空呢 ^_^' })
      }

      if (QRCodeInfo.isDealBizType()) {
        this.$store.commit('SET_ORDER_REMARK', this.remark)

        if (QRCodeInfo.hasPhoneNumber()) {
          if (this.needChoosePeopleNumberPage) {
            this.$router.push({ name: 'PeopleNumber' })
          } else {
            this.$store.dispatch('ADD_ORDER')
          }
        } else {
          this.$store.commit('SET_PURPOSE_OF_PHONE_VERIFY', ADD_ORDER)
          this.$router.push({ name: 'PhoneVerify' })
        }
      } else if (QRCodeInfo.isEShopBizType()) {
        this.$store.commit('SET_ORDER_REMARK', this.remark)
        this.$store.dispatch('ADD_ORDER').catch(err => {
          vToast({ content: '啊哦, 下订单失败, 请重试下 ^_^' })
        })
      } else {
        console.error(`Unknown biz type: ${QRCodeInfo.getBizType()}`)
      }
    }
  }
}
