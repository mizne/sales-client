<template>
  <div class="coupon-item" @click="selectItem(coupon)">
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
      <div class="coupon-date">
        <span>{{coupon.InvalidDate | couponDate}}</span>
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
      return fecha.format(new Date(v), 'YYYY-MM-DD')
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
</style>


