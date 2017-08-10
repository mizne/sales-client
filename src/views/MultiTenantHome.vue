<template>
  <div class="home-page">
    <img style="width:100%;height:100%;" src="../assets/images/dinning.jpg" alt="">
     <!-- <div class="each-section">
      <ul>
        <li v-for="item in path1" :key="item.$index" @click="toIndustry(item)">
          <span>
            <img :src="item.imgPath" alt="">
          </span>
          <span>{{item.label}}</span>
        </li>
      </ul>
  
      <ul>
        <li v-for="item in path2" :key="item.$index" @click="toIndustry(item)">
          <span>
            <img :src="item.imgPath" alt="">
          </span>
          <span>{{item.label}}</span>
        </li>
      </ul>
    </div>  -->

    <a href="tel:18761342997">万鑫</a>
    <a href="geopoint:108.954823,34.275891">我的位置</a>
    <footer>
      <x-button type="primary" @click.native="toMe">我的</x-button>
    </footer>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { XButton } from 'vux'

import { objFrom } from '@/util/index'
import QRCodeInfo from '@/models/QRCodeInfo'

export default {
  name: 'MultiTenantHome',
  components: {
    XButton
  },
  data() {
    return {
      path1: [
        {
          "name": "lobster",
          "label": "龙虾",
          "imgPath": require("../assets/images/lobster.png")
        },
        {
          "name": "food",
          "label": "餐饮",
          "imgPath": require("../assets/images/food.png")
        },
        {
          "name": "educate",
          "label": "教育",
          "imgPath": require("../assets/images/educate.png")
        },
        {
          "name": "fitness",
          "label": "健身",
          "imgPath": require("../assets/images/fitness.png")
        },

      ],
      path2: [{
        "name": "carBeauty",
        "label": "汽车美容",
        "imgPath": require("../assets/images/carBeauty.png")
      },
      {
        "name": "lifeServe",
        "label": "服务",
        "imgPath": require("../assets/images/lifeServe.png")
      },
      {
        "name": "buildingMater",
        "label": "家装建材",
        "imgPath": require("../assets/images/buildingMater.png")
      },
      {
        "name": "bakedTea",
        "label": "烘焙茶饮",
        "imgPath": require("../assets/images/bakedTea.png")
      },]
    }
  },
  methods: {
    toIndustry(item) {
      this.$store.commit('SET_INDUSTRY_LABEL', item.label)
      this.$router.push({ name: 'IndustryHome', params: { name: item.label } })
    },
    toMe() {
      this.$router.push({ name: 'VIPCard' })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';
.home-page {
  .each-section {
    position: absolute;
    width: 100%;
    z-index: 1000;
    top: 30%;
    padding: 10px 10px;
    box-sizing: border-box;

    ul {
      width: 100%;
      li {
        display: inline-block;
        width: 25%;
        a {
          font-size: 2rem;
          text-decoration: none;
          color: #fff;
          cursor: pointer;
        }
        span {
          display: block;
          text-align: center;
          border-radius: 60px;
          background-color: #fff;
          margin-top: 30px;
          img {
            position: relative;
            top: 15%;
            height: 40px;
          }
        }
        b {
          font-weight: normal;
        }
      }
      li:first-child {
        b {
          position: relative;
          left: 10%;
        }
      }
      li:nth-child(2) {
        b {
          position: relative;
          left: 10%;
        }
      }
      li:nth-child(3) {
        b {
          position: relative;
          left: 10%;
        }
      }
      li:nth-child(4) {
        b {
          position: relative;
          left: 10%;
        }
      }
    }
  }

  a {
     display: block;
     width: 100%; 
     height: 40px;
     background-color: green;
     color: white;
     margin-top: 10px;
     text-align: center;
     line-height: 40px;
  }

  footer {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
}
</style>



