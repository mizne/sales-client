<template>
  <div class="nearby-container">
    <deal-header title="附近的店">
    </deal-header>
  
    <deal-content>
      <div class="shops">
        <shop-item v-for="shop in shops" :key="shop.$index" :shop="shop"></shop-item>
      </div>
    </deal-content>
  
    <deal-footer>
      <tabs v-if="hasTabs"></tabs>
    </deal-footer>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'
import DealFooter from '@/components/DealFooter'
import Tabs from '@/components/Tabs'
import QRCodeInfo from '@/models/QRCodeInfo'
import ShopItem from '@/components/ShopItem'

export default {
  name: 'AllOrders',
  components: {
    DealHeader,
    DealContent,
    DealFooter,
    Tabs,
    ShopItem
  },
  data() {
    return {
      hasTabs: false,
      shops: [
        {
          name: '老乡鸡',
          img: require('../assets/logo.png'),
          description: '起送价20元|配送费3元',
          sellCountPerMonth: '185',
          promotions: '满15减8, 满20减12'
        },
        {
          name: '谐众千百味',
          img: require('../assets/logo.png'),
          description: '起送价29元|配送费3元',
          sellCountPerMonth: '1850',
          promotions: '满15减8, 满200减12'
        },
        {
          name: '谐众千百味',
          img: require('../assets/logo.png'),
          description: '起送价29元|配送费3元',
          sellCountPerMonth: '1850',
          promotions: '满15减8, 满200减12'
        },
        {
          name: '谐众千百味',
          img: require('../assets/logo.png'),
          description: '起送价29元|配送费3元',
          sellCountPerMonth: '1850',
          promotions: '满15减8, 满200减12'
        },
        {
          name: '谐众千百味',
          img: require('../assets/logo.png'),
          description: '起送价29元|配送费3元',
          sellCountPerMonth: '1850',
          promotions: '满15减8, 满200减12'
        },
        {
          name: '谐众千百味',
          img: require('../assets/logo.png'),
          description: '起送价29元|配送费3元',
          sellCountPerMonth: '1850',
          promotions: '满15减8, 满200减12'
        },
        {
          name: '谐众千百味',
          img: require('../assets/logo.png'),
          description: '起送价29元|配送费3元',
          sellCountPerMonth: '1850',
          promotions: '满15减8, 满200减12'
        },
        {
          name: '谐众千百味',
          img: require('../assets/logo.png'),
          description: '起送价29元|配送费3元',
          sellCountPerMonth: '1850',
          promotions: '满15减8, 满200减12'
        },
        {
          name: '谐众千百味',
          img: require('../assets/logo.png'),
          description: '起送价29元|配送费3元',
          sellCountPerMonth: '1850',
          promotions: '满15减8, 满200减12'
        },
        {
          name: '谐众千百味',
          img: require('../assets/logo.png'),
          description: '起送价29元|配送费3元',
          sellCountPerMonth: '1850',
          promotions: '满15减8, 满200减12'
        },
        {
          name: '谐众千百味',
          img: require('../assets/logo.png'),
          description: '起送价29元|配送费3元',
          sellCountPerMonth: '1850',
          promotions: '满15减8, 满200减12'
        }
      ]
    }
  },
  methods: {

  },
  created() {
    this.hasTabs = QRCodeInfo.hasTenants()
    this.$store.commit('SET_TAB_INDEX', 1)
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.nearby-container {
  .deal-header-container {}

  .deal-content-container {
    padding: 10px;
    background-color: $greyBackground;
    margin-bottom: 50px;
  }
}
</style>
<style lang="scss">
.shops {
  .shop-item {
    margin-top: 20px;
  }
}
</style>



