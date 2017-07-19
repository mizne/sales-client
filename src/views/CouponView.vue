<template>
  <div class="coupon-view-container">
    <deal-header title="选择优惠券">
    </deal-header>
  
    <deal-content>
      <tab>
        <tab-item selected @on-item-click="onItemClick('avaliable')">可用</tab-item>
        <tab-item @on-item-click="onItemClick('disabled')">不可用</tab-item>
      </tab>

      <template v-if="couponsToShow.length > 0">
        <coupon-item v-for="coupon in couponsToShow" :key="coupon.couponKey" 
        :coupon="coupon" :merchant="tenantName" :selected-coupon="selectedCoupon" :filter="filter" @select-coupon="selectItem"></coupon-item>
      </template>
      <template v-else>
        <div class="no-coupon">还没有优惠券呢 ^_^</div>
      </template>
    </deal-content>
  </div>
</template>
<script>
import { Tab, TabItem } from 'vux'
import { mapGetters } from 'vuex'

import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'
import CouponItem from '@/components/CouponItem'

export default {
  name: 'CouponView',
  components: {
    Tab,
    TabItem,
    DealHeader,
    DealContent,
    CouponItem
  },
  data() {
    return {
      filter: 'avaliable',
      couponsToShow: []
    }
  },
  computed: {
    ...mapGetters(['avaliableCoupons', 'disableCoupons', 'selectedCoupon', 'tenantName'])
  },
  methods: {
    onItemClick(filter) {
      this.filter = filter
      if (filter === 'avaliable') {
        this.couponsToShow = this.avaliableCoupons
      } else {
        this.couponsToShow = this.disableCoupons
      }
    },
    selectItem(coupon) {
      if (this.filter === 'disabled') {
        return 
      }

      if (this.selectedCoupon && this.selectedCoupon.couponKey === coupon.couponKey) {
        this.$store.dispatch('SELECT_COUPON', null)
      } else {
        this.$store.dispatch('SELECT_COUPON', coupon)
      }
    }
  },
  created() {
    this.couponsToShow = this.avaliableCoupons
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.coupon-view-container {
  .deal-header-container {}

  .deal-content-container {
    padding: 10px;
    background-color: $greyBackground;
    height: 100vh;

    .no-coupon {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;
    }
  }
}
</style>


