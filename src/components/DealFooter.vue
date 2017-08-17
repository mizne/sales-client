<template>
  <div class="deal-footer-container">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'DealFooter'
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.deal-footer-container {
  @include flexboxCenter;
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  line-height: 50px;
  height: 50px;
  color: #fff;
  text-align: center;
  background-color: $blackBackground;
}
</style>


