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
        <prompt text="还没有订单呢, 还不快去下单 ^_^"></prompt>
      </template>
    </deal-content>
  
    <deal-footer v-if="hasTabs">
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
import Prompt from '@/components/Prompt'

import { timeago, generateBetweenDate } from '@/util/index'
import QRCodeInfo from '@/models/QRCodeInfo'
import { UN_PAY_ORDER, WAIT_PAY_ORDER, PAYED_ORDER } from '@/util/constants'

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
    PopupRadio,
    Prompt
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
      hasTabs: false,
      dateFormat: dateMap[generateBetweenDate.WEEK],
      dateFormats: [generateBetweenDate.WEEK, generateBetweenDate.MONTH, generateBetweenDate.YEAR].map(e => dateMap[e])
    }
  },
  methods: {
    toOrderDetail(order) {
      this.$store.commit('SET_TENANT_ID', order.tenantId)
      this.$store.commit('SET_TABLE_NAME', order.tableName)
      
      if (order.status === UN_PAY_ORDER || order.status === WAIT_PAY_ORDER) {
        this.$router.push({ name: 'OrderSuccess' })
      }

      if (order.status === PAYED_ORDER) {
        this.$router.push({ name: 'OrderDetail', params: { tradeNo: order.tradeNo } })
      }
    },
  },
  created() {
    this.hasTabs = QRCodeInfo.hasTenants()
    this.$store.commit('SET_TAB_INDEX', 2)
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
    margin-bottom: 50px;
    .popup-radio {
      background-color: $whiteBackground;
    }
  }
}
</style>


