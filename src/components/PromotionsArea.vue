<template>
  <div class="promotions-area">
    <div class="promotions-items1">
      <promotions-item v-for="item in promotionsItems1" :key="item.$index" @to-tenant="toTenant(item)" :tenant="item"></promotions-item> 
    </div>
  
    <!-- <div class="promotions-items2">
      <promotions-item v-for="item in promotionsItems2" :key="item.$index" @click="toTenant(item)" :tenant="item"></promotions-item> 
    </div> -->
  </div>
</template>
<script>
import PromotionsItem from '@/components/PromotionsItem'
import toTenant from '@/mixins/to-tenant'

export default {
  name: 'IndustryArea',
  mixins: [toTenant],
  components: {
    PromotionsItem
  },
  data() {
    return {
      promotionsItems1: [
        {
          "name": "lobster",
          "label": "9.9元起",
          "textColor": "#f04134",
          "img": require("../assets/images/shucai.jpg"),
          "description": "满减促销",
          "id": "18d473e77f459833bb06c60f9a8f0002"
        },
        {
          "name": "food",
          "label": "美味披萨",
          "textColor": "#00a854",
          "img": require("../assets/images/dianying.jpg"),
          "description": "大折扣",
          "id": "d5495b96870e70797dbef12fc32b5d40"
        },
        {
          "name": "educate",
          "label": "0元1元",
          "textColor": "#108ee9",
          "img": require("../assets/images/mianfei.jpg"),
          "description": "免费抢不停",
          "id": "8b093db931ba90587b358d304aaf6049"
        },
      ],
      promotionsItems2: [
        {
          "name": "carBeauty",
          "label": "新客专享",
          "textColor": "#f56a00",
          "img": require("../assets/images/dianying2.jpg"),
          "description": "领10元约影"
        },
        {
          "name": "lifeServe",
          "label": "打车特惠",
          "textColor": "#7265e6",
          "img": require("../assets/images/hongbao.jpg"),
          "description": "红包一起抢"
        },
        {
          "name": "buildingMater",
          "label": "1元普吉",
          "textColor": "#ffbf00",
          "img": require("../assets/images/gentuan.jpg"),
          "description": "周四跟团特价"
        },
        {
          "name": "bakedTea",
          "label": "劲享优惠",
          "textColor": "#00a2ae",
          "img": require("../assets/images/haodian.jpg"),
          "description": "探人民的好店"
        },]
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';
.promotions-area {
  padding: 10px 0;
  box-sizing: border-box;
  background-color: $whiteBackground;
  margin-top: 20px;

  .promotions-items1,
  .promotions-items2 {
    display: flex;
    &:not(:first-child) {
      padding-top: 10px;
    }
  }

  .promotions-items1 {
    border-bottom: 1px solid $greyText;
  }
}
</style>


