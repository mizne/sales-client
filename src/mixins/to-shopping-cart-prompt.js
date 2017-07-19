import { mapGetters } from 'vuex'
import storage from '@/util/storage'
import { DEAL, ESHOP } from '@/util/constants'
import { ADD_SHOPPING_CART } from '@/store/modules/phoneVerify'
import { vAlert, vToast } from '@/util/vux-wrapper'

export default {
  computed: {
    ...mapGetters(['tempShoppingCartFoodCost', 'tempShoppingCartFoodCount', 'shoppingCart', 'hasClosed'])
  },
  methods: {
    toShopCart() {
      // 如果 店铺已打烊
      if (this.hasClosed) {
        return vAlert({ content: '真的不能买啦, 明天再来吧 ^_^' })
      }

      // 如果临时购物车和购物车 都没有 则提示 还没有点菜
      if (
        this.tempShoppingCartFoodCost === 0 &&
        this.shoppingCart.totalPrice === 0
      ) {
        return vAlert({ content: '购物车还是空的呢 ^_^' })
      } else {
        const bizType = storage.get('bizType')
        // 点餐 业务
        if (bizType === DEAL) {
          this.$store.dispatch('ADD_SHOPPING_CART').catch(err => {
            vToast({
              content: '添加购物车失败, 请稍后重试 ^_^',
            })
          })
        } else if (bizType === ESHOP) {
          // 代售 需先提供手机号码
          if (storage.has('phoneNumber')) {
            this.$store.dispatch('ADD_SHOPPING_CART').catch(err => {
              vToast({ content: '添加购物车失败, 请稍后重试 ^_^' })
            })
          } else {
            this.$store.commit('SET_PURPOSE_OF_PHONE_VERIFY', ADD_SHOPPING_CART)
            this.$router.push({ name: 'PhoneVerify' })
          }
        } else {
          console.error(`Unknown biz type: ${bizType}`)
        }
      }
    }
  }
}
