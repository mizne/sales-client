<template>
  <div class="main-page">
    <!--<div class="head-content" :style="{'background-image': 'url('+ industryImage + ')'}">-->
      <!-- <span>
        <img style="width:100%;height:40%;" src="../assets/images/dinning.jpg">
      </span> -->
      <!--<div class="top-pointer">{{industryLabel}}</div>-->
    <!--</div>-->

    <swiper :list="industryImg" :auto="true" height="230px" dots-class="custom-bottom" dots-position="center"></swiper>

    <template v-if="shops.length > 0">
      <div class="shops">
        <shop-item v-for="shop in shops" :key="shop.id" :shop="shop" @to-shop="toTenant"></shop-item>
      </div>
    </template>
    <template v-else>
      <prompt text="商家正在上线中, 敬请期待" style="bottom: 30%;"></prompt>
    </template>

  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { XButton, Swiper } from 'vux'
import ShopItem from '@/components/ShopItem'
import Prompt from '@/components/Prompt'

import toTenant from '@/mixins/to-tenant'
import { not } from '@/util/index'

export default {
  name: 'IndustryHome',
  mixins: [toTenant],
  components: {
    ShopItem,
    Prompt,
    Swiper
  },
  computed: {
    ...mapGetters(['industryLabel', 'industryImg', 'tenants'])
  },
  data() {
    return {
      shops: [],
      industryImage: null,
      images: [{
        url: 'javascript:',
        img: require('../assets/images/biyige.jpg')
      }, {
        url: 'javascript:',
        img: require('../assets/images/weishuwu.jpg')
      }, {
        url: 'javascript:',
        img: require('../assets/images/huangmenlaozao.jpg')
      }
      ],
    }
  },
  created() {
//  this.industryImage = require(`../assets/images/${this.industryImg}.jpg`)
    const industryShops = this.tenants.filter(e => e.industry === this.$route.params.name)
    const isOpen = e => e.openFlag

    this.shops = [...industryShops.filter(isOpen), ...industryShops.filter(not(isOpen))]
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
      color: #fff;
      padding-left: 20px;
      box-sizing: border-box;
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
