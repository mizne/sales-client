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
  position: relative;
  min-height: calc(100vh - 60px);
}
</style>


