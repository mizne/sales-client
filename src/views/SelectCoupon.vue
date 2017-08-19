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
          <swipeout>
            <div v-for="coupon in couponsToShow" :key="coupon.$index">
              <swipeout-item transition-mode="follow" :disabled="true">
                <div slot="right-menu">
                  <swipeout-button @click.native="deleteCoupon(coupon)" type="warn">删除</swipeout-button>
                </div>
                <div slot="content">
                  <coupon-item :key="coupon.couponKey" :coupon="coupon" :merchant="tenantName" :selected-coupon="selectedCoupon" :filter="filter" @select-coupon="selectItem"></coupon-item>
                </div>
              </swipeout-item>
            </div>
          </swipeout>
        </div>
      </template>

      <template v-else>
        <prompt text="还没有优惠券呢, 还不快去扫码领取 ^_^"></prompt>
      </template>
    </deal-content>
  </div>
</template>
<script>
import { Tab, TabItem, Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
import { mapGetters } from 'vuex'

import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'
import CouponItem from '@/components/CouponItem'
import Prompt from '@/components/Prompt'

import { vToast } from '@/util/vux-wrapper'

export default {
  name: 'SelectCoupon',
  components: {
    Tab,
    TabItem,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    DealHeader,
    DealContent,
    CouponItem,
    Prompt
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
  watch: {
    avaliableCoupons(v) {
      if (this.filter === 'avaliable') {
        this.couponsToShow = this.avaliableCoupons
      }
    },
    disableCoupons(v) {
      if (this.filter === 'disabled') {
        this.couponsToShow = this.disableCoupons
      }
    }
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
      } else {
        this.$store.dispatch('SELECT_COUPON', coupon)
        vToast({
          type: 'success',
          content: '已选中优惠券'
        })
      }

      this.$router.push({ name: 'OrderSuccess' })
    },
    deleteCoupon(coupon) {
      this.$store.dispatch('DELETE_COUPON', coupon)
        .then(_ => {
          this.$store.dispatch('FETCH_AVALIABLE_COUPONS')
        })
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
      padding: 50px 10px 0 10px;

      .coupon-item:first-child {
        // padding-top: 50px;
      }
    }
  }
}
</style>


