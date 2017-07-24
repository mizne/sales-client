<template>
  <div class="alipay-callback-container">
    <deal-header title="结账单">
      <span class="header-left" slot="left" style="width: 40px;">
        <i class="icon-back" @click="$router.push({ name: 'OrderSuccess' })"></i>
      </span>
    </deal-header>
  
    <deal-content>
      <bill-detail v-if="orderDetail" :order-detail="orderDetail" :tenant-name="tenantName"
       :pay-time="payTime" pay-mode="支付宝"></bill-detail>
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
import BillBar from '@/components/BillBar'

import { objFrom } from '@/util/index'
import { vAlert } from '@/util/vux-wrapper'


export default {
  name: 'AlipayCallback',
  components: {
    DealHeader,
    DealContent,
    DealFooter,
    BillDetail,
    BillBar
  },
  computed: {
    ...mapGetters(['orderDetail', 'tenantName'])
  },
  data() {
    return {
      payTime: '',
    }
  },
  methods: {
    toShopComment() {
      this.$router.push({ name: 'ShopComment' })
    }
  },
  created() {
    // 由于 Alipay 回调重新拉起应用, 故需 重新初始化状态
    const obj = objFrom(decodeURIComponent(location.search))
    this.payTime = obj.timestamp

    this.$store.dispatch('FETCH_TENANT_CONFIG')
      .then(_ => {
        document.title = this.tenantName
      })

    this.$store.dispatch('FETCH_ORDER', obj.out_trade_no)
      .catch(err => {
        vAlert({
          content: '获取订单失败 -_-',
        })
      })
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.alipay-callback-container {
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


