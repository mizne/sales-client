<template>
  <div class="offline-pay-result-container">
    <deal-header title="退房时支付">
    </deal-header>

    <deal-content>
      <p class="prompt">
        {{offlinePayResult ? '该订单已备注退房时支付，要记得哦亲' : '服务器打瞌睡了，请稍后重试下'}}
      </p>
      <img src="../assets/images/fruits-pineapple.gif" alt="">
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
      font-size: 1.5rem;
      margin: 30px 0;
      color: $greyText;
    }
    img {
      display: block;
      margin: 0 auto;
    }
  }
}
</style>


