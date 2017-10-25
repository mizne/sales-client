<template>
  <div class="order-status-container">
    <deal-header title="订单状态">
      <a class="header-right" slot="right" style="width: 40px;" :href="'tel:' + orderDetail.merchantPhone">
        <i class="icon-phone" style="color: black;"></i>
      </a>
    </deal-header>

    <deal-content>
      <div class="tabs">
        <tab>
          <tab-item selected @on-item-click="onItemClick('status')">订单状态</tab-item>
          <tab-item @on-item-click="onItemClick('detail')">订单详情</tab-item>
        </tab>
      </div>

      <template v-if="view === 'status'">
        <timeline :current="current">
          <timeline-item>
            <div class="timeline-item">
              <div class="name">订单已提交</div>
              <div class="time">{{commitOrderTime}}</div>
            </div>
          </timeline-item>
          <timeline-item>
            <div class="timeline-item">
              <div class="name">支付成功</div>
              <div class="time">{{payOrderTime}}</div>
            </div>
          </timeline-item>
          <timeline-item>
            <div class="timeline-item">
              <div class="name">等待商家接单</div>
              <div class="time">{{acceptOrderTime}}</div>
            </div>
          </timeline-item>
          <timeline-item>
            <div class="timeline-item">
              <div class="name">等待接货</div>
              <div class="time">{{receiveGoodsTime}}</div>
            </div>
          </timeline-item>
        </timeline>

        <wait-order v-if="current === 1" :order-time="orderTime" :duration="duration" @timeout="orderTimeout()"></wait-order>
      </template>

      <template v-if="view === 'detail'">
        <!-- <p style="text-align: center;">订单详情</p> -->
        <bill-detail :order-detail="orderDetail"></bill-detail>
      </template>
    </deal-content>

    <deal-footer>
      <x-button style="height: 100%">取消订单</x-button>
    </deal-footer>
  </div>
</template>
<script>
import { Tab, TabItem, XButton } from 'vux'
import { mapGetters } from 'vuex'
import fecha from 'fecha'

import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'
import DealFooter from '@/components/DealFooter'
import BillDetail from '@/components/BillDetail'
import Timeline from '@/components/Timeline'
import TimelineItem from '@/components/TimelineItem'
import WaitOrder from '@/components/WaitOrder'

import QRCodeInfo from '@/models/QRCodeInfo'

export default {
  name: 'OrderStatus',
  components: {
    DealHeader,
    DealContent,
    DealFooter,
    Tab,
    TabItem,
    BillDetail,
    Timeline,
    TimelineItem,
    WaitOrder,
    XButton
  },
  computed: {
    ...mapGetters(['orderDetail']),
    orderTime() {
      if (this.orderDetail) {
        return this.orderDetail.time
      }
      return fecha.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
    },
    current() {
      if (this.orderDetail) {
        return this.orderDetail.status
      }
      return 1
    },
    commitOrderTime() {
      if (this.orderDetail) {
        return this.orderDetail.time
      }
      return ''
    },
    payOrderTime() {
      if (this.orderDetail && this.orderDetail.status >= 2) {
        return this.orderDetail.payTime
      }
      return ''
    },
    acceptOrderTime() {
      if (this.orderDetail && this.orderDetail.status >= 3) {
        return this.orderDetail.acceptTime
      }
      return ''
    },
    receiveGoodsTime() {
      if (this.orderDetail && this.orderDetail.status >= 4) {
        return this.orderDetail.receiveTime
      }
      return ''
    }
  },
  data() {
    return {
      view: 'status',
      // current: 1,
      // orderTime: '2017-08-15 18:21:00',
      duration: 5,
      timer: null
    }
  },
  methods: {
    onItemClick(view) {
      this.view = view
    },
    orderTimeout() {
      // console.log('order timeout!')
    },
    initTimer() {
      const tradeNo = this.$route.query.tradeNo

      this.$store.dispatch('FETCH_ORDER', tradeNo)
      this.timer = window.setInterval(() => {
        this.$store.dispatch('FETCH_ORDER', tradeNo)
      }, 2e4)
    }
  },
  created() {
    this.initTimer()
  },
  beforeDestroy() {
    window.clearInterval(this.timer)
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
  }
}
</style>
<style lang="scss">
@import '../assets/css/main.scss';
.timeline-item {
  min-height: 50px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .name {
    @include flexboxCenter;
    flex: 3;
  }
  .time {
    @include flexboxCenter;
    flex: 1;
  }
}
</style>



