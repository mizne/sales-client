<template>
  <div class="industry-item">
    <div class="icon-wrapper" :style="{'backgroundColor': backgroundColor}">
      <i :class="['icon-' + icon]"></i>
    </div>
    <span>{{label}}</span>
    <div class="badge" v-if="badge">{{badge}}</div>
  </div>
</template>
<script>
export default {
  name: 'IndustryItem',
  props: {
    label: {
      type: String
    },
    icon: {
      type: String
    },
    backgroundColor: {
      type: String
    },
    badge: {
      type: String
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';
.industry-item {
  @include flexboxCenter;
  flex-direction: column;
  
  

  .icon-wrapper {
    @include flexboxCenter;
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: $primaryColor;
    i {
      color: white;
      font-size: 1.4rem;
    }
  }

  span {
    font-size: .8rem;
    margin-top: 5px;
  }

  .badge {
    @include flexboxCenter;
    position: absolute;
    width: 30px;
    top: 0;
    right: 10px;
    background-color: $primaryColor;
    border-radius: 30%;
    color: white;
    font-size: .6rem;
  }
}
</style>


