<template>
  <div class="promotions-area">
    <div class="promotions-items1">
      <promotions-item v-for="item in promotionsItems1" :key="item.$index" @click="toIndustry(item)" :label="item.label" :text-color="item.textColor" :img="item.img" :description="item.description"></promotions-item> 
    </div>
  
    <div class="promotions-items2">
      <promotions-item v-for="item in promotionsItems2" :key="item.$index" @click="toIndustry(item)" :label="item.label" :text-color="item.textColor" :img="item.img" :description="item.description"></promotions-item> 
    </div>
  </div>
</template>
<script>
import PromotionsItem from '@/components/PromotionsItem'

export default {
  name: 'IndustryArea',
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
          "img": require("../assets/logo.png"),
          "description": "甩脂大作战"
        },
        {
          "name": "food",
          "label": "机票1折起",
          "textColor": "#00a854",
          "img": require("../assets/logo.png"),
          "description": "跟着电影旅行"
        },
        {
          "name": "educate",
          "label": "0元1元",
          "textColor": "#108ee9",
          "img": require("../assets/logo.png"),
          "description": "免费抢不停"
        },
      ],
      promotionsItems2: [
        {
          "name": "carBeauty",
          "label": "新客专享",
          "textColor": "#f56a00",
          "img": require("../assets/logo.png"),
          "description": "领10元约影"
        },
        {
          "name": "lifeServe",
          "label": "打车特惠",
          "textColor": "#7265e6",
          "img": require("../assets/logo.png"),
          "description": "红包一起抢"
        },
        {
          "name": "buildingMater",
          "label": "1元普吉",
          "textColor": "#ffbf00",
          "img": require("../assets/logo.png"),
          "description": "周四跟团特价"
        },
        {
          "name": "bakedTea",
          "label": "劲享优惠",
          "textColor": "#00a2ae",
          "img": require("../assets/logo.png"),
          "description": "探人民的好店"
        },]
    }
  },
  methods: {
    toIndustry(item) {
      this.$store.commit('SET_INDUSTRY_LABEL', item.label)
      this.$router.push({ name: 'IndustryHome', params: { name: item.label } })
    },
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


