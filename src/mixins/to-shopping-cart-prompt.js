import { mapGetters } from 'vuex'
import { ADD_SHOPPING_CART } from '@/store/modules/phoneVerify'
import { vAlert, vToast } from '@/util/vux-wrapper'
import QRCodeInfo from '@/models/QRCodeInfo'

export default {
  computed: {
    ...mapGetters([
      'tempShoppingCartFoodCost', 
      'tempShoppingCartFoodCount', 
      'shoppingCart', 
      'hasClosed', 
      'orderDetail',
      'needDeliveryFee',
      'distanceTooFar'
    ])
  },
  methods: {
    toShopCart() {
      // 如果 店铺已打烊
      if (this.hasClosed) {
        return vAlert({ content: '真的不能买啦, 明天再来吧 ^_^' })
      }

      if (this.needDeliveryFee && this.distanceTooFar) {
        return vAlert({ content: '距离过远, 不支持配送 -_-' })
      }

      // 如果 临时购物车和购物车 都没有商品 则提示 还没有点菜
      if (
        this.tempShoppingCartFoodCost === 0 
        && this.shoppingCart.totalPrice === 0
        && !this.orderDetail
      ) {
        return vAlert({ content: '购物车还是空的呢 ^_^' })
      } else {
        // 点餐 业务
        if (QRCodeInfo.isDealBizType()) {
          this.$store.dispatch('ADD_SHOPPING_CART').catch(err => {
            vToast({
              content: '添加购物车失败, 请稍后重试 ^_^',
            })
          })
        } else if (QRCodeInfo.isEShopBizType() || QRCodeInfo.isGroupShoppingBizType() || QRCodeInfo.isMultiEShopBizType()) {
          // 代售 群购业务 需先提供手机号码
          if (QRCodeInfo.hasPhoneNumber()) {
            this.$store.dispatch('ADD_SHOPPING_CART').catch(err => {
              vToast({ content: '添加购物车失败, 请稍后重试 ^_^' })
            })
          } else {
            this.$store.commit('SET_PURPOSE_OF_PHONE_VERIFY', ADD_SHOPPING_CART)
            this.$router.push({ name: 'PhoneVerify' })
          }
        } else {
          console.error(`Unknown biz type: ${QRCodeInfo.getBizType()}`)
        }
      }
    }
  }
}
