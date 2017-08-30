<template>
  <div class="pay-to-merchant-container">
    <deal-header title="向商户付款">
    </deal-header>

    <deal-content>
      <numkeyboard v-model="num" ok-text="OK" text-align="left"></numkeyboard>

      <!-- <input type="number"> -->
    </deal-content>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'

export default {
  name: 'PayToMerchant',
  data() {
    return {
      num: 1
    }
  },
  components: {
    DealHeader,
    DealContent,
  },
  computed: {
    ...mapGetters(['allCoupons', 'tenantName'])
  },
  methods: {

  },
  created() {
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.pay-to-merchant-container {
  .deal-header-container {}

  .deal-content-container {
    padding: 10px;
    background-color: $greyBackground;
    height: 100vh;
  }
}
</style>


