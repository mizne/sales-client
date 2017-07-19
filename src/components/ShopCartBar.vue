<template>
  <div class="shopcart-bar-container">
    <div class="left-area">
      <span>{{addMore ? '新增' : ''}}菜品</span>
      <div class="food-count">{{foodCount}}</div>
      <i class="icon-money"></i>
      <span>{{foodCost}}</span>
    </div>
    <div class="right-area">
      <x-button class="btn" type="warn" @click.native="toShopCart">购物车</x-button>
    </div>
  </div>
</template>
<script>
import { XButton } from 'vux'
export default {
  name: 'ShopCartBar',
  components: {
    XButton
  },
  props: {
    addMore: {
      type: Boolean,
      default: false
    },
    shopCart: {
      type: Object
    },
    foodCount: {
      type: Number
    },
    foodCost: {
      type: Number
    }
  },
  methods: {
    toShopCart() {
      this.$emit('go-shopcart')
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
