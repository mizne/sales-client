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

      <div class="coupon-items" v-if="couponsToShow.length > 0">
        <coupon-item v-for="coupon in couponsToShow" :key="coupon.couponKey" 
        :coupon="coupon" :merchant="tenantName" :selected-coupon="selectedCoupon" :filter="filter" @select-coupon="selectItem"></coupon-item>
      </div>
      <div v-else class="no-coupon">
        <div>还没有优惠券呢, 还不快去扫码领取 ^_^</div>
      </div>
    </deal-content>
  </div>
</template>
<script>
import { Tab, TabItem } from 'vux'
import { mapGetters } from 'vuex'

import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'
import CouponItem from '@/components/CouponItem'

import { vToast } from '@/util/vux-wrapper'

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
        vToast({
          type: 'cancel',
          content: '已取消优惠券'
        })
        this.$router.back()
      } else {
        this.$store.dispatch('SELECT_COUPON', coupon)
        vToast({
          type: 'success',
          content: '已选中优惠券'
        })
        this.$router.back()
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
    }

    .coupon-items {
      .coupon-item:first-child {
        margin-top: 50px;
      }
    }

    .no-coupon {
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


