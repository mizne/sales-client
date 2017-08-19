<template>
  <div class="promotions-item" @click="toTenant(tenant)">
    <div class="label">
      {{tenant.label}}
    </div>
    <div class="description" :style="{'color': tenant.textColor}">{{tenant.description}}</div>
    <div class="image-wrapper">
      <div class="image" :style="{'background-image': 'url('+tenant.img+')'}"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PromotionsItem',
  props: {
    tenant: {
      type: Object
    }
  },
  methods: {
    toTenant(tenant) {
      this.$emit('to-tenant', tenant)
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


