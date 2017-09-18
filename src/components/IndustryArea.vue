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
          "imgName":[{
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
          "icon": "lobster",
          "backgroundColor": "#f04134",
          // "badge": "1折"
        },
        {
          "name": "food",
          "label": "儿童休闲",
//        "imgName": "旅游",
          "imgName":[{
              url: 'javascript:',
              img: require('../assets/images/旅游.jpg')
              }],
          "icon": "lvyou",
          "backgroundColor": "#00a854",
          // "badge": "1折"
        },
        {
          "name": "educate",
          "label": "教育",
//        "imgName": "教育",
          "imgName":[{
            url: 'javascript:',
            img: require('../assets/images/教育.jpg')
          }],
          "icon": "jiaoyu",
          "backgroundColor": "#108ee9",
          // "badge": "1折"
        },
        {
          "name": "fitness",
          "label": "服装",
//        "imgName": "健身",
          "imgName":[{
            url: 'javascript:',
            img: require('../assets/images/健身.jpg')
          }],
          "icon": "jianshen",
          "backgroundColor": "#f5317f",
          // "badge": "1折"
        },

      ],
      industryItems2: [
        {
          "name": "bakedTea",
          "label": "烘焙饮品",
//        "imgName": "烘焙茶饮",
          "imgName":[{
            url: 'javascript:',
            img: require('../assets/images/烘焙茶饮.jpg')
          }],
          "icon": "yinpin",
          "backgroundColor": "#00a2ae",
          // "badge": "1折"
        },
        {
          "name": "carBeauty",
          "label": "美容美发",
//        "imgName": "汽车美容",
          "imgName":[{
            url: 'javascript:',
            img: require('../assets/images/汽车美容.jpg')
          }],
          "icon": "qichebaoyang",
          "backgroundColor": "#f56a00",
          // "badge": "1折"
        },
        {
          "name": "lifeServe",
          "label": "影城",
//        "imgName": "服务",
          "imgName":[{
            url: 'javascript:',
            img: require('../assets/images/服务.jpg')
          }],
          "icon": "fuwu",
          "backgroundColor": "#7265e6",
          // "badge": "1折"
        },
        {
          "name": "buildingMater",
          "label": "综合",
//        "imgName": "家装建材",
          "imgName":[{
            url: 'javascript:',
            img: require('../assets/images/家装建材.jpg')
          }],
          "icon": "jiazhuang",
          "backgroundColor": "#ffbf00",
          // "badge": "1折"
        }
      ]
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


