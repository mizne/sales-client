<template>
  <div class="coupon-item" @click="selectItem(coupon)">
    <div :class="['abstract', filter]">
      <div class="money">
        <i v-if="coupon.couponType === 'discount'" class="icon-discount"></i>
        <i v-else class="icon-money"></i>
        <span class="number">{{coupon.value | couponValue(coupon)}}</span>
      </div>
      <div class="info">
        <span>{{coupon.couponType | couponType(coupon)}}</span>
      </div>
    </div>
    <div class="description">
      <div class="coupon-from">
        <span>{{merchant}}</span>
      </div>
      <div class="coupon-date">
        <span>{{coupon.createdAt | couponDate}} </span> --
        <span> {{coupon.InvalidDate | couponDate}}</span>
      </div>
    </div>
  
    <div class="action">
      <i class="icon-right" v-if="selectedCoupon && selectedCoupon.couponKey === coupon.couponKey"></i>
    </div>
  </div>
</template>
<script>
import Coupon from '@/models/Coupon'
import fecha from 'fecha'

export default {
  name: 'CouponItem',
  props: {
    coupon: {
      type: Object
    },
    selectedCoupon: {
      type: Object,
      default: null
    },
    merchant: {
      type: String
    },
    filter: {
      type: String,
      default: 'avaliable'
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
      return fecha.format(new Date(v), 'YYYY.MM.DD')
    }
  },
  methods: {
    selectItem(coupon) {
      this.$emit('select-coupon', coupon)
    }
  },
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

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
      position: relative;
      background: radial-gradient(white 0, white 5px, $primaryColor 5px);
      background-size: 15px 15px;
      background-position: 9px 3px;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 10px;
        right: 0;
        background-color: #1AAD19 !important;
      }
    }

    &.disabled {
      background-color: $warnColor;
    }

    .money,
    .info {
      @include flexboxCenter;
      z-index: 2;

      .number {
        font-size: 1.3rem;
        margin-left: 5px;
      }
    }

    .money {
      i {
        margin-top: 7px;
      }
    }

    .info {
      padding-left: 4px;
      font-size: 0.8rem;
    }
  }

  .description {
    flex: 5;
    height: 100%;
    color: $primaryTextColor;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;

    .coupon-from,
    .coupon-date {
      @include flexboxCenter;
    }

    .coupon-date {
      font-size: .9rem;
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
</style>


