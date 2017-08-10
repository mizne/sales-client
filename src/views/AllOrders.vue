<template>
  <div class="order-view-container">
    <deal-header title="全部订单">
    </deal-header>
  
    <deal-content>
      <popup-radio class="popup-radio" title="选择日期" :options="dateFormats" v-model="dateFormat"></popup-radio>
  
      <template v-if="allOrders.length > 0">
        <order-item v-for="order in allOrders" :key="order.tradeNo" :order="order" @to-detail="toOrderDetail"></order-item>
      </template>
      <template v-else>
        <div class="no-order">还没有订单呢, 还不快去下单 ^_^</div>
      </template>
    </deal-content>

    <deal-footer>
      <tabs></tabs>
    </deal-footer>
  </div>
</template>
<script>
import { PopupRadio } from 'vux'
import { mapGetters } from 'vuex'

import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'
import DealFooter from '@/components/DealFooter'
import Tabs from '@/components/Tabs'
import OrderItem from '@/components/OrderItem'
import { timeago, generateBetweenDate } from '@/util/index'
const dateMap = {
  [generateBetweenDate.WEEK]: '周',
  [generateBetweenDate.MONTH]: '月',
  [generateBetweenDate.YEAR]: '年'
}
export default {
  name: 'AllOrders',
  components: {
    DealHeader,
    DealContent,
    DealFooter,
    Tabs,
    OrderItem,
    PopupRadio
  },
  computed: {
    ...mapGetters(['allOrders'])
  },
  watch: {
    dateFormat(v) {
      const key = Object.keys(dateMap).find(e => dateMap[e] === v)
      this.$store.dispatch('FETCH_ALL_ORDERS', key)
    }
  },
  data() {
    return {
      dateFormat: dateMap[generateBetweenDate.WEEK],
      dateFormats: [generateBetweenDate.WEEK, generateBetweenDate.MONTH, generateBetweenDate.YEAR].map(e => dateMap[e])
    }
  },
  methods: {
    toOrderDetail(order) {
      if (order.status !== 2) {
        this.$store.commit('SET_TENANT_ID', order.tenantId)
        this.$store.commit('SET_TABLE_NAME', order.tableName)

        this.$router.push({ name: 'OrderSuccess' })
      }
    },
  },
  created() {
    this.$store.dispatch('FETCH_ALL_ORDERS', generateBetweenDate.WEEK)
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.order-view-container {
  .deal-header-container {}

  .deal-content-container {
    padding: 10px;
    background-color: $greyBackground;
    height: 100vh;

    .popup-radio {
      background-color: white;
    }

    .no-order {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;
      position: relative;
      top: 30%;
    }
  }
}
</style>


