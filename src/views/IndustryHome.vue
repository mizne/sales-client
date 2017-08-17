<template>
  <div class="main-page">
    <div class="head-content" :style="{'background-image': 'url('+ industryImage + ')'}">
      <!-- <span>
        <img style="width:100%;height:40%;" src="../assets/images/dinning.jpg">
      </span> -->
      <div class="top-pointer">{{industryLabel}}</div>
    </div>
  
    <template v-if="shops.length > 0">
      <div class="shops">
        <shop-item v-for="shop in shops" :key="shop.id" :shop="shop" @to-shop="toTenant"></shop-item>
      </div>
    </template>
    <template v-else>
      <prompt text="商家正在上线中, 敬请期待"></prompt>
    </template>
  
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

import ShopItem from '@/components/ShopItem'
import Prompt from '@/components/Prompt'

import QRCodeInfo from '@/models/QRCodeInfo'
import toTenant from '@/mixins/to-tenant'

export default {
  name: 'IndustryHome',
  mixins: [toTenant],
  components: {
    ShopItem,
    Prompt
  },
  computed: {
    ...mapGetters(['industryLabel'])
  },
  data() {
    return {
      shops: [],
      industryImage: null
    }
  },
  created() {
    this.industryImage = require(`../assets/images/${this.industryLabel}.jpg`)
    const allTenants = QRCodeInfo.getTenants()
    this.shops = allTenants.filter(e => e.industry === this.$route.params.name)
  }
}
</script>
<style lang="scss">
@import '../assets/css/main.scss';

.main-page {
  .head-content {
    position: relative;
    width: 100%;
    height: 200px;
    background-size: cover;

    .top-pointer {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 4rem;
      line-height: 4rem;
      font-size: 2rem;
      background-color: rgba(121, 121, 121, 0.8);
      font-weight: 500;
      color: $greyText;
      padding-left: 20px;
    }
  }
  .shops {
    width: 100%;
    background-color: $greyBackground;
  }

  .no-shops {
    margin-top: 100px;
    text-align: center;
    color: $greyText;
  }
}
</style>
