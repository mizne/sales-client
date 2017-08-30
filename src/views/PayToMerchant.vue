<template>
  <div class="pay-to-merchant-container">
    <deal-header title="向商户付款">
    </deal-header>

    <deal-content>
      <div class="title">
        <div class="shop-icon">
          <div class="icon-wrapper">
            <i class="icon-shop"></i>
          </div>
        </div>
        <div class="shop-desc">
          向潘多拉--南京--南京基地-03付款
        </div>
      </div>

      <div class="amount">
        <div class="abstract">消费金额</div>
        <div class="input-area">
          <div class="prefix">￥</div>
          <div class="content">
            <numkeyboard ref="board" v-model="num" ok-text="付款" @onOk="pay" text-align="left"></numkeyboard>
          </div>
        </div>
      </div>
    </deal-content>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'

import { vToast } from '@/util/vux-wrapper'

export default {
  name: 'PayToMerchant',
  data() {
    return {
      num: ''
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
    pay(value) {
      if (String(value).split(/\./).length > 2) {
        this.num = ''
        return vToast({ content: '请输入正确金额' })
      }

      this.$store.dispatch('FETCH_ALIPAY_EPAY', parseFloat(value).toFixed(2))
      console.log(parseFloat(value).toFixed(2))
    }
  },
  created() {

  },
  mounted() {
    console.log(this.$refs.board.showKeyboard = true)
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.pay-to-merchant-container {
  .deal-header-container {}

  .deal-content-container {
    padding: 10px;
    background-color: #eaeaea;
    height: 100vh;

    .title {
      margin-top: 20px;
      .shop-icon {
        @include flexboxCenter;

        .icon-wrapper {
          @include flexboxCenter;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #2b91e2;
          i {
            color: #fff;
            font-size: 1.3rem;
          }
        }
      }

      .shop-desc {
        margin-top: 20px;
        text-align: center;
      }
    }

    .amount {
      background-color: #fff;
      margin-top: 20px;
      padding: 10px;
      border-radius: 4px;

      .input-area {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .content {
          flex: 1;
        }
      }
    }
  }
}
</style>


