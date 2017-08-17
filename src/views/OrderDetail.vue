<template>
  <div class="order-detail-container">
    <deal-header title="订单详情">
    </deal-header>
  
    <deal-content>
       <bill-detail v-if="orderDetail" :order-detail="orderDetail"></bill-detail> 
    </deal-content>
  
    <deal-footer v-if="orderDetail">
      <bill-bar @to-shopcomment="toShopComment"></bill-bar>
    </deal-footer>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'
import DealFooter from '@/components/DealFooter'
import BillDetail from '@/components/BillDetail'

import { vAlert } from '@/util/vux-wrapper'

export default {
  name: 'OrderDetail',
  components: {
    DealHeader,
    DealContent,
    DealFooter,
    BillDetail
  },
  computed: {
    ...mapGetters(['orderDetail'])
  },
  methods: {
    toShopComment() {

    }
  },
  created() {
    this.$store.dispatch('FETCH_ORDER', this.$route.params.tradeNo)
      .catch(err => {
        vAlert({
          content: '获取订单失败 -_-',
        })
      })
  }
}
</script>
<style lang="scss" scoped>
.order-detail-container {}
</style>


