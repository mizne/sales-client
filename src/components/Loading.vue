<template>
  <div class="mask">
    <div class="loading">
      <i class="icon-loading"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loading'
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';
.mask {
  @include flexboxCenter;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.5);
  
  .loading {
    text-align: center;
    .icon-loading {
      color: $primaryColor;
      display: inline-block;
      font-size: 5rem;
      -webkit-animation: gif 1.5s infinite linear;
      animation: gif 1.5s infinite linear;
    }
    @keyframes gif {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
    @-webkit-keyframes gif {
      0% {
        -webkit-transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
      }
    }
  }
}
</style>