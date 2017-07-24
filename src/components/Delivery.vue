<template>
  <div class="delivery-container">
    <!-- <div class="delivery">
          <span class="delivery-label">距离:</span>
          <span class="delivery-placeholder"></span>
          <span class="delivery-value">
            <span>{{deliveryDistance | normalize}}</span>
          </span>
        </div> -->
    <div class="delivery">
      <span class="delivery-label">配送费:</span>
      <span class="delivery-placeholder"></span>
      <span class="delivery-value">
        <span>+</span>
        <i class="icon-money"></i>
        <span>{{deliveryFeeValue | currencyRatio}}</span>
      </span>
    </div>

  
  </div>
</template>
<script>
export default {
  name: 'Delivery',
  props: {
    deliveryFeeValue: {
      type: String
    },
    deliveryTime: {
      type: String
    },
    deliveryDistance: {
      type: Number
    },
    couponValue: {
      type: Number
    }
  },
  filters: {
    normalize(v) {
      return Number(v / 1000).toFixed(1) + '千米'
    },
    currencyRatio(v) {
      return Number(v).toFixed(2)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';
.delivery-container {
  margin-top: 15px;
  .delivery {
    @include flexboxCenter;
    height: 40px;
    margin-top: -6px;
    background-color: #fff;
    text-align: center;
    border-radius: 5px;
    .delivery-label,
    .delivery-placeholder,
    .delivery-value {
      flex: 1;
      @include flexboxCenter;
    }

    .delivery-value {
      color: $primaryColor;
    }
  }
}
</style>


