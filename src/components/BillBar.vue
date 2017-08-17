<template>
  <div class="shopcart-bar-container">
    <!-- <div class="left-area">
      <span>欢迎提供建议</span>
    </div>
    <div class="right-area">
      <x-button class="btn" type="primary" @click.native="toShopComment">评价一下</x-button>
    </div> -->

    <div class="left-area">
      <span>关注公众号优惠多多</span>
    </div>
    <div class="right-area">
      <x-button class="btn" type="primary" @click.native="toAttention">一键关注</x-button>
    </div>
  </div>
</template>
<script>
import { XButton } from 'vux'
import { ATTENTION_HREF } from '@/util/constants'

export default {
  name: 'BillBar',
  components: {
    XButton
  },
  methods: {
    toShopComment() {
      this.$emit('to-shopcomment')
    },
    toAttention() {
      window.location.href = ATTENTION_HREF
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
