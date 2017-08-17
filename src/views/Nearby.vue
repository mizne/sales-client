<template>
  <div class="nearby-container">
    <deal-header title="附近的店">
    </deal-header>
  
    <deal-content>
      <div class="shops">
        <shop-item v-for="shop in shops" :key="shop.$index" :shop="shop" @to-shop="toTenant"></shop-item>
      </div>
    </deal-content>
  
    <deal-footer v-if="hasTabs">
      <tabs></tabs>
    </deal-footer>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'
import DealFooter from '@/components/DealFooter'
import Tabs from '@/components/Tabs'
import ShopItem from '@/components/ShopItem'

import QRCodeInfo from '@/models/QRCodeInfo'
import toTenant from '@/mixins/to-tenant'

export default {
  name: 'AllOrders',
  mixins: [toTenant],
  components: {
    DealHeader,
    DealContent,
    DealFooter,
    Tabs,
    ShopItem
  },
  computed: {
    ...mapGetters(['tenants'])
  },
  data() {
    return {
      hasTabs: false,
      shops: []
    }
  },
  created() {
    this.hasTabs = QRCodeInfo.isMultiEShopBizType()
    this.$store.commit('SET_TAB_INDEX', 1)

    this.shops = this.tenants.filter((_, i) => i % 2 === 1)
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.nearby-container {
  .deal-header-container {}

  .deal-content-container {
    padding: 10px 0;
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



