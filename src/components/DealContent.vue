<template>
  <div class="deal-content-container">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'DealContent'
}
</script>
<style lang="scss" scoped>
.deal-content-container {
  position: absolute;
  top: 40px;
  right: 0;
  bottom: 50px;
  left: 0;
}
</style>


