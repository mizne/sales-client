<template>
  <div class="industry-area">
    <ul>
      <li v-for="item in industryItems1" :key="item.$index" @click="toIndustry(item)">
         <industry-item :label="item.label" :icon="item.icon" :badge="item.badge" :background-color="item.backgroundColor"></industry-item> 
      </li>
    </ul>
  
    <ul>
      <li v-for="item in industryItems2" :key="item.$index" @click="toIndustry(item)">
        <industry-item :label="item.label" :icon="item.icon" :badge="item.badge" :background-color="item.backgroundColor"></industry-item> 
      </li>
    </ul>
  </div>
</template>
<script>
import IndustryItem from '@/components/IndustryItem'

export default {
  name: 'IndustryArea',
  components: {
    IndustryItem
  },
  data() {
    return {
      industryItems1: [
        {
          "name": "lobster",
          "label": "美食",
          "imgName": "美食外卖",
          "icon": "lobster",
          "backgroundColor": "#f04134",
          // "badge": "1折"
        },
        {
          "name": "food",
          "label": "儿童休闲",
          "imgName": "旅游",
          "icon": "lvyou",
          "backgroundColor": "#00a854",
          // "badge": "1折"
        },
        {
          "name": "educate",
          "label": "教育",
          "imgName": "教育",
          "icon": "jiaoyu",
          "backgroundColor": "#108ee9",
          // "badge": "1折"
        },
        {
          "name": "fitness",
          "label": "服饰",
          "imgName": "健身",
          "icon": "jianshen",
          "backgroundColor": "#f5317f",
          // "badge": "1折"
        },

      ],
      industryItems2: [
        {
          "name": "carBeauty",
          "label": "美容美发",
          "imgName": "汽车美容",
          "icon": "qichebaoyang",
          "backgroundColor": "#f56a00",
          // "badge": "1折"
        },
        {
          "name": "lifeServe",
          "label": "影城",
          "imgName": "服务",
          "icon": "fuwu",
          "backgroundColor": "#7265e6",
          // "badge": "1折"
        },
        {
          "name": "buildingMater",
          "label": "综合",
          "imgName": "家装建材",
          "icon": "jiazhuang",
          "backgroundColor": "#ffbf00",
          // "badge": "1折"
        },
        {
          "name": "bakedTea",
          "label": "烘焙茶饮",
          "imgName": "烘焙茶饮",
          "icon": "yinpin",
          "backgroundColor": "#00a2ae",
          // "badge": "1折"
        },]
    }
  },
  methods: {
    toIndustry(item) {
      this.$store.commit('SET_INDUSTRY_LABEL', item.label)
      this.$store.commit('SET_INDUSTRY_IMG', item.imgName)
      this.$router.push({ name: 'IndustryHome', params: { name: item.label } })
    },
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';
.industry-area {
  width: 100%;
  padding: 10px 0;
  box-sizing: border-box;
  background-color: $whiteBackground;

  ul {
    display: flex;
    &:not(:first-child) {
      margin-top: 10px;
    }
    li {
      position: relative;
      flex: 1;
    }
  }
}
</style>


