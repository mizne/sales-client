<template>
  <div class="home-page">
    <swiper :list="images" :auto="true" height="180px" dots-class="custom-bottom" dots-position="center"></swiper>
    <industry-area></industry-area>
    <promotions-area></promotions-area>
    <recommend-area></recommend-area>
    <deal-footer>
      <tabs>
      </tabs>
    </deal-footer>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { XButton, Swiper } from 'vux'

import { objFrom } from '@/util/index'
import QRCodeInfo from '@/models/QRCodeInfo'
import Tabs from '@/components/Tabs'
import DealFooter from '@/components/DealFooter'
import IndustryArea from '@/components/IndustryArea'
import PromotionsArea from '@/components/PromotionsArea'
import RecommendArea from '@/components/RecommendArea'

export default {
  name: 'MultiTenantHome',
  components: {
    XButton,
    Swiper,
    Tabs,
    DealFooter,
    IndustryArea,
    PromotionsArea,
    RecommendArea
  },
  data() {
    return {
      images: [{
        url: 'javascript:',
        img: require('../assets/images/xuehuabing.jpg')
      }, {
        url: 'javascript:',
        img: require('../assets/images/lashangyin.png')
      }, {
        url: 'javascript:',
        img: require('../assets/images/qingdoujia.jpg')
      }],
    }
  },
  created() {
    this.$store.commit('SET_TAB_INDEX', 0)
    document.title = '缤润汇商场'
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';
.home-page {
  width: 100%;
  background-color: $greyBackground;
  margin-bottom: 50px;

  footer {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
}
</style>



