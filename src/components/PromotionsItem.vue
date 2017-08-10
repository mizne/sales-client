<template>
  <div class="promotions-item">
    <div class="label">
      {{label}}
    </div>
    <div class="description" :style="{'color': textColor}">{{description}}</div>
    <div class="image-wrapper">
      <div class="image" :style="{'background-image': 'url('+img+')'}"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PromotionsItem',
  props: {
    label: {
      type: String
    },
    textColor: {
      type: String
    },
    img: {
      type: String
    },
    description: {
      type: String
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';
.promotions-item {
  @include flexboxCenter;
  flex-direction: column;
  flex: 1;

  .description {
    font-size: .8rem;
  }

  .image-wrapper {
    @include flexboxCenter;
    width: 80%;
    height: 80px;

    .image {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-size: 100% 100%;
    }
  }

  &:not(:first-child) {
    border-left: 1px solid $greyText;
  }
}
</style>


