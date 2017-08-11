<template>
  <div class="coupon-view-container">
    <deal-header title="选择优惠券">
    </deal-header>
  
    <deal-content>
      <div class="tabs">
        <tab>
          <tab-item selected @on-item-click="onItemClick('avaliable')">可用</tab-item>
          <tab-item @on-item-click="onItemClick('disabled')">不可用</tab-item>
        </tab>
      </div>
  
      <template v-if="couponsToShow.length > 0">
        <div class="coupon-items">
          <coupon-item v-for="coupon in couponsToShow" :key="coupon.couponKey" :coupon="coupon" :merchant="tenantName" :selected-coupon="selectedCoupon" :filter="filter" @select-coupon="selectItem"></coupon-item>
        </div>
      </template>
  
      <template v-else>
        <no-coupon></no-coupon>
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
import NoCoupon from '@/components/NoCoupon'

import { vToast } from '@/util/vux-wrapper'

export default {
  name: 'SelectCoupon',
  components: {
    Tab,
    TabItem,
    DealHeader,
    DealContent,
    CouponItem,
    NoCoupon
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
        vToast({
          type: 'cancel',
          content: '已取消优惠券'
        })
        window.setTimeout(() => {
          this.$router.back()
        }, 500)
      } else {
        this.$store.dispatch('SELECT_COUPON', coupon)
        vToast({
          type: 'success',
          content: '已选中优惠券'
        })
        window.setTimeout(() => {
          this.$router.back()
        }, 500)
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
    background-color: $greyBackground;
    height: 100vh;

    .tabs {
      position: fixed;
      width: 100%;
      z-index: 1;
    }

    .coupon-items {
      padding: 0 10px;

      .coupon-item:first-child {
        padding-top: 50px;
      }
    }
  }
}
</style>


