<template>
  <div class="vip-card-container">
    <deal-header title="我的">
    </deal-header>
  
    <deal-content>
      <div class="phone-info">
        <span class="label">手机号</span>
        <span class="number">{{phoneNumber}}</span>
      </div>
  
      <div class="card-detail">
        <div class="abstract">
          <div class="points">
            <span class="number">10</span>
            <span class="text">我的积分</span>
          </div>
  
          <div class="bag" @click="toCoupon()">
            <i class="icon-bag"></i>
            <span class="text">我的券包</span>
          </div>
  
          <div class="gift" @click="toOrder()">
            <i class="icon-gift"></i>
            <span class="text">我的订单</span>
          </div>
        </div>
  
        <!-- <div class="card-item points">
              <i class="icon-points"></i>
              <span class="text">积分换券</span>
              <i class="icon-forward"></i>
            </div>
            <div class="card-item user">
              <i class="icon-user"></i>
              <span class="text">个人资料</span>
              <i class="icon-forward"></i>
            </div>
            <div class="card-item shops">
              <i class="icon-shop"></i>
              <span class="text">使用门店</span>
              <i class="icon-forward"></i>
            </div> -->
      </div>
    </deal-content>
  
    <deal-footer>
      <tabs v-if="hasTabs">
      </tabs>
    </deal-footer>
  </div>
</template>
<script>
import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'
import DealFooter from '@/components/DealFooter'
import DealDialog from '@/components/DealDialog'
import Tabs from '@/components/Tabs'

import QRCodeInfo from '@/models/QRCodeInfo'
import { vAlert, vConfirm } from '@/util/vux-wrapper'
import router from '@/router/index'
import store from '@/store/index'
import { VERIFY_USER } from '@/store/modules/phoneVerify'

export default {
  name: 'OrderSuccess',
  components: {
    DealHeader,
    DealContent,
    DealFooter,
    DealDialog,
    Tabs
  },
  data() {
    return {
      hasTabs: false,
      phoneNumber: ''
    }
  },
  methods: {
    toCoupon() {
      this.$router.push({ name: 'AllCoupons' })
    },
    toOrder() {
      this.$router.push({ name: 'AllOrders' })
    }
  },
  created() {
    this.phoneNumber = QRCodeInfo.getPhoneNumber()
    this.hasTabs = QRCodeInfo.hasTenants()
  },
  beforeRouteEnter(to, from, next) {
    if (!QRCodeInfo.hasPhoneNumber()) {
      vConfirm({ content: '您还没有验证手机号码呢', confirmText: '去验证', cancelText: '不了' })
        .then(_ => {
          store.commit('SET_PURPOSE_OF_PHONE_VERIFY', VERIFY_USER)
          router.push({ name: 'PhoneVerify' })
        })
        .catch(_ => {
          next(false)
        })
    } else {
      next()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.vip-card-container {
  height: 100vh;
  .deal-header-container {}

  .deal-content-container {
    padding: 10px;
    background-color: $greyBackground;
    bottom: 0;

    .phone-info {
      height: 50px;
      color: #aaa;
      background-color: #fff;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }

    .card-detail {
      margin-top: 10px;
      height: 230px;


      .abstract {
        display: flex;
        height: 80px;
        background-color: #fff;
        justify-content: space-around;
        align-items: center;

        .points,
        .bag,
        .gift {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .points {
          .number {
            color: $primaryColor;
            transform: scale(1.5);
            margin-bottom: 10px;
          }
        }

        .bag {
          i {
            color: $primaryColor;
            transform: scale(1.5);
            margin-bottom: 10px;
          }
        }

        .gift {
          i {
            color: $primaryColor;
            transform: scale(1.5);
            margin-bottom: 10px;
          }
        }
      }

      .card-item {
        height: 50px;
        background-color: #fff;
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-top: 2px;

        i {
          transform: scale(2);
        }
      }
    }
  }
  .deal-dialog-container {
    .content {
      @include flexboxCenter;
      height: 50px;
    }

    .btn-group {
      height: 50px;
      display: flex;
      justify-content: space-around;
      align-items: center;

      .cancel,
      .ok {
        flex: 1;
        color: $primaryColor;
      }
    }
  }
}
</style>


