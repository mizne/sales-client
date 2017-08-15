<template>
  <div class="nearby-container">
    <deal-header title="附近的店">
    </deal-header>
  
    <deal-content>
      
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

export default {
  name: 'AllOrders',
  components: {
    DealHeader,
    DealContent,
    DealFooter,
    Tabs,
  },
  data() {
    return {
      hasTabs: false,
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


