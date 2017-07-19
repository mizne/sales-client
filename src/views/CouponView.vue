<template>
  <div class="coupon-view-container">
    <deal-header title="优惠券">
    </deal-header>
  
    <deal-content>
      <tab>
        <tab-item selected @on-item-click="onItemClick('avaliable')">可用</tab-item>
        <tab-item @on-item-click="onItemClick('disabled')">不可用</tab-item>
      </tab>

      <template v-if="couponsToShow.length > 0">
        <div class="coupon-item" v-for="coupon in couponsToShow" :key="coupon.couponKey" @click="selectItem(coupon)">
          <div :class="['abstract', filter]">
            <div class="money">
              <i v-if="coupon.couponType === 'discount'" class="icon-discount"></i>
              <i v-else class="icon-money"></i>
              <span style="margin-left: 10px;">{{coupon.value | couponValue(coupon)}}</span>
            </div>
            <div class="info">
              <span>{{coupon.couponType | couponType(coupon)}}</span>
            </div>
          </div>
          <div class="description">
            <!-- <div class="coupon-from">
              <span>{{coupon.from || '平台放送'}}</span>
            </div> -->
            <div class="coupon-date">
              <span>{{coupon.createdAt | couponDate}}</span>
            </div>
          </div>

          <div class="action">
            <i class="icon-right" v-if="selectedCoupon && selectedCoupon.couponKey === coupon.couponKey"></i>
          </div>
        </div>
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
import fecha from 'fecha'

import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'

import storage from '@/util/storage'
import Coupon from '@/models/Coupon'

export default {
  name: 'CouponView',
  components: {
    Tab,
    TabItem,
    DealHeader,
    DealContent,
  },
  data() {
    return {
      filter: 'avaliable',
      couponsToShow: []
    }
  },
  filters: {
    couponType(value, coupon) {
      return new Coupon(coupon.couponType, coupon.value).getTypeText()
    },
    couponValue(value, coupon) {
      return new Coupon(coupon.couponType, coupon.value).getValueText()
    },
    couponDate(v) {
      return fecha.format(new Date(v), 'YYYY-MM-DD')
    }
  },
  computed: {
    ...mapGetters(['avaliableCoupons', 'disableCoupons', 'selectedCoupon'])
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

    .coupon-item {
      @include flexboxCenter;
      margin: 5px 0;
      background-color: white;
      height: 100px;
      

      .abstract {
        flex: 2;
        height: 100%;
        
        color: white;
        display: flex;
        justify-content: center;
        flex-direction: column;

        &.avaliable {
          background-color: $primaryColor;
        }

        &.disabled {
          background-color: $warnColor;
        }

        .money,
        .info {
          @include flexboxCenter;
        }

        .info {
          font-size: 0.9rem;
        }

      }

      .description {
        flex: 5;
        height: 100%;
        color: $text;
        display: flex;
        justify-content: center;
        flex-direction: column;

        .coupon-from,
        .coupon-date {
          @include flexboxCenter;
        }
      }

      .action {
        flex: 1;
        height: 100%;
        color: $primaryColor;
        @include flexboxCenter;
        .icon-right {
          font-size: 2rem;
        }
      }
    }

    .no-coupon {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;
    }
  }
}
</style>


