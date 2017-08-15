<template>
  <div class="tabs-container">
    <div class="tab-item" :class="{'selected': tabIndex === 0}" @click="toMultiTenantHome()">
          <i class="icon-home"></i>
          <span>首页</span>
        </div>
        <div class="tab-item" :class="{'selected': tabIndex === 1}" @click="toNearByShops()">
          <i class="icon-address"></i>
          <span>附近</span>
        </div>
        <div class="tab-item" :class="{'selected': tabIndex === 2}" @click="toAllOrders()">
          <i class="icon-order"></i>
          <span>订单</span>
        </div>
        <div class="tab-item" :class="{'selected': tabIndex === 3}" @click="toMine()">
          <i class="icon-my"></i>
          <span>我的</span>
        </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Tabs',
  computed: {
    ...mapGetters(['tabIndex'])
  },
  methods: {
    toMultiTenantHome() {
      this.$store.commit('SET_TAB_INDEX', 0)
      this.$router.push({ name: 'MultiTenantHome' })
    },
    toNearByShops() {
      this.$store.commit('SET_TAB_INDEX', 1)
      this.$router.push({ name: 'Nearby' })
    },
    toAllOrders() {
      this.$store.commit('SET_TAB_INDEX', 2)
      this.$router.push({ name: 'AllOrders' })
    },
    toMine() {
      this.$store.commit('SET_TAB_INDEX', 3)
      this.$router.push({ name: 'Mine' })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';
.tabs-container {
  @include flexboxCenter;
  border-top: 1px $greyText solid;
  height: 50px;
  width: 100%;
  color: black;
  background-color: #fbf9fe;

  .tab-item {
    flex: 1;
    @include flexboxCenter;
    flex-direction: column;
    line-height: 27px;

    i {
      font-size: 1.4rem;
    }

    &.selected {
      i, span {
        color: $primaryColor;
      }
    }

    span {
      margin-top: -5px;
      font-size: .9rem;
      margin-bottom: -4px;
    }
  }
}
</style>


