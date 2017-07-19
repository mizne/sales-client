<template>
  <div class="coupon-view-container">
    <deal-header title="所有优惠券">
    </deal-header>
  
    <deal-content>
      <template v-if="allCoupons.length > 0">
        <coupon-item v-for="coupon in allCoupons" :key="coupon.couponKey" 
        :coupon="coupon"></coupon-item>
      </template>
      <template v-else>
        <div class="no-coupon">还没有优惠券呢 ^_^</div>
      </template>
    </deal-content>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'
import CouponItem from '@/components/CouponItem'

export default {
  name: 'AllCoupons',
  components: {
    DealHeader,
    DealContent,
    CouponItem
  },
  computed: {
    ...mapGetters(['allCoupons', 'tenantName'])
  },
  created() {
    this.$store.dispatch('FETCH_AVALIABLE_COUPONS')
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


