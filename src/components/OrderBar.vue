<template>
  <div class="shopcart-bar-container">
    <div class="left-area">
      <span>共计</span>
      <i class="icon-money"></i>
      <span>{{orderCost}}</span>
    </div>
    <div class="right-area">
      <x-button class="btn" type="warn" @click.native="toPay">买单</x-button>
    </div>
  </div>
</template>
<script>
import { XButton } from 'vux'
export default {
  name: 'OrderBar',
  components: {
    XButton
  },
  props: {
    orderCost: {
      type: Number
    }
  },
  methods: {
    toPay() {
      this.$emit('to-pay')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.shopcart-bar-container {
  width: 100%;
  display: flex;
  
  .left-area {
    @include flexboxCenter;
    flex: 1;

    .food-count {
      @include flexboxCenter;
      position: absolute;
      left: 26%;
      top: 2px;
      line-height: 14px;
      padding: 1px 0;
      background-color: $warnColor;
      text-align: center;
      border-radius: 50%;
      font-size: 12px;
      width: 18px;
      height: 18px;
    }
  }

  .right-area {
    @include flexboxCenter;
    flex: 1;

    .btn {
      width: 80%;
    }
  }
}
</style>
