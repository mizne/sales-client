<template>
  <div class="offline-pay-result-container">
    <deal-header title="退房时支付">
    </deal-header>

    <deal-content>
      <p class="prompt">
        {{offlinePayResult ? '该订单已备注退房时支付，要记得哦亲' : '服务器打瞌睡了，请稍后重试下'}}
      </p>
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
    }
  },
  components: {
    DealHeader,
    DealContent,
  },
  computed: {
    ...mapGetters(['offlinePayResult'])
  },
  methods: {
  },
  created() {
    console.log(this.offlinePayResult)
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.offline-pay-result-container {
  .deal-header-container {}

  .deal-content-container {
    padding: 10px;
    background-color: $greyBackground;
    height: 100vh;

    .prompt {
      text-align: center;
      font-size: 1.8rem;
      margin-top: 50px;
    }
  }
}
</style>


