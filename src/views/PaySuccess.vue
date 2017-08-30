<template>
  <div class="pay-success-container">
    <deal-header title="支付成功">
    </deal-header>

    <deal-content>
      <div class="title">
        <div class="shop-icon">
          <div class="icon-wrapper">
            <i class="icon-right"></i>
          </div>
        </div>
        <div class="shop-desc">
          支付成功
        </div>

        <div class="amount">
          <span class="sign">￥</span>
          <span class="number">16.00</span>
        </div>

        <div class="order">
          <span class="sign">订单后四位</span>
          <span class="number">3898</span>
        </div>

        <div class="btn-div">
          <div class="btn-label">关注公众号 优惠多多</div>
          <div class="btn-wrapper">
            <x-button type="default" @click.native="toAttention">一键关注</x-button>
          </div>
        </div>
      </div>

    </deal-content>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { XButton } from 'vux'

import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'

import { vToast } from '@/util/vux-wrapper'
import { ATTENTION_HREF } from '@/util/constants'
import { objFrom } from '@/util/index'

export default {
  name: 'PayToMerchant',
  data() {
    return {
    }
  },
  components: {
    DealHeader,
    DealContent,
    XButton
  },
  computed: {
    ...mapGetters(['allCoupons', 'tenantName'])
  },
  methods: {
    toAttention() {
      window.location.href = ATTENTION_HREF
    }
  },
  created() {
    const obj = objFrom(decodeURIComponent(location.search))

    window.alert(JSON.stringify(obj, null, 2))
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.pay-success-container {
  .deal-header-container {}

  .deal-content-container {
    padding: 10px;
    background-color: $greyBackground;
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
        color: #2b91e2;
        margin-top: 20px;
        text-align: center;
      }

      .amount {
        @include flexboxCenter;
        .number {
          font-size: 2rem;
        }
      }

      .order {
        @include flexboxCenter;
        color: $greyText;
        .number {
          margin-left: 10px;
        }
      }

      .btn-div {
        @include flexboxCenter;
        margin-top: 20px;
        flex-direction: column;
        .btn-label {
          color: $greyText;
          margin-bottom: 10px;
        }

        button {
          width: 100px;
          color: #2b91e2;
        }
      }
    }
  }
}
</style>


