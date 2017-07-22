<template>
  <div class="delivery-container">
    <div class="delivery">
      <span class="delivery-label">距离:</span>
      <span class="delivery-placeholder"></span>
      <span class="delivery-value">
        <span>{{deliveryDistance | normalize}}</span>
      </span>
    </div>
    <div class="delivery">
      <span class="delivery-label">配送费:</span>
      <span class="delivery-placeholder"></span>
      <span class="delivery-value">
        <i class="icon-money"></i>
        <span>{{deliveryFeeValue}}</span>
      </span>
    </div>
    <div class="delivery">
      <span class="delivery-label">配送时间:</span>
      <span class="delivery-placeholder"></span>
      <span class="delivery-value">
        <span>{{deliveryTime}}</span>
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
    }
  },
  filters: {
    normalize(v) {
      return Number(v).toFixed(1) + '千米'
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';
.delivery-container {
  .delivery {
    @include flexboxCenter;
    height: 40px;
    margin-top: 10px;
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


