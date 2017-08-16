import { vAlert } from '@/util/vux-wrapper'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['tenantName', 'hasClosed', 'needDeliveryFee'])
  },
  methods: {
    toTenant(item) {
      this.$store.commit('SET_TENANT_ID', item.id)
      this.$store.commit('SET_TABLE_NAME', item.tableName)

      this.$store.dispatch('FETCH_TENANT_CONFIG')
        .then(_ => {
          if (this.hasClosed) {
            vAlert({
              content: '啊哦, 店铺已打烊, 只能看不能买了, 明天再来吧 ^_^'
            })
          }
          document.title = this.tenantName

          // 代售业务且商户有经纬度才获取 配送费
          if (this.needDeliveryFee) {
            this.$store.dispatch('FETCH_DELIVERY_FEE')
          }
        })
        .then(_ => {
          this.$router.push({ name: 'Menu' })
        })

    }
  }
}