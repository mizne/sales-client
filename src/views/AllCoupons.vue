<template>
  <div class="coupon-view-container">
    <deal-header title="所有优惠券">
    </deal-header>

    <deal-content>

      <template v-if="allCoupons.length > 0">
        <swipeout>
          <div v-for="coupon in allCoupons" :key="coupon.$index">
            <swipeout-item transition-mode="follow">
              <div slot="right-menu">
                <swipeout-button @click.native="deleteCoupon(coupon)" type="warn">删除</swipeout-button>
              </div>
              <div slot="content">
                <coupon-item :key="coupon.couponKey" :coupon="coupon" :merchant="tenantName"></coupon-item>
              </div>
            </swipeout-item>
          </div>
        </swipeout>
      </template>
      <template v-else>
        <prompt text="还没有优惠券呢, 还不快去扫码领取 ^_^"></prompt>
      </template>
    </deal-content>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'

import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'
import CouponItem from '@/components/CouponItem'
import Prompt from '@/components/Prompt'

export default {
  name: 'AllCoupons',
  components: {
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    DealHeader,
    DealContent,
    CouponItem,
    Prompt
  },
  computed: {
    ...mapGetters(['allCoupons', 'tenantName'])
  },
  methods: {
    deleteCoupon(coupon) {
      this.$store.dispatch('DELETE_COUPON', coupon)
        .then(_ => {
          this.$store.dispatch('FETCH_ALL_COUPONS')
        })
    }
  },
  created() {
    this.$store.dispatch('FETCH_ALL_COUPONS')
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
  }
}
</style>


