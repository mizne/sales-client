<template>
  <div class="vip-card-container">
    <deal-header title="会员卡">
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
  
          <div class="bag">
            <i class="icon-bag"></i>
            <span class="text">我的券包</span>
          </div>
  
          <div class="gift">
            <i class="icon-gift"></i>
            <span class="text">我的特权</span>
          </div>
        </div>
  
        <div class="card-item points">
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
        </div>
      </div>
    </deal-content>
  
    <deal-footer>
      <div class="comment" @click="$router.push({name: 'ShopComment'})">
        <i class="icon-comment"></i>
        <span class="text">评价</span>
      </div>
  
      <div class="add-food">
        <i class="icon-food"></i>
        <span class="text">加菜</span>
      </div>
  
      <div class="pay" @click="toPay">
        <i class="icon-pay"></i>
        <span class="text">买单</span>
      </div>
    </deal-footer>
  
    <deal-dialog v-model="showDialog">
      <div class="content">是否用餐完毕, 现在去买单?</div>
      <div class="btn-group">
        <span class="cancel" @click="cancelDialog">取消</span>
        <span class="ok" @click="okDialog">确认</span>
      </div>
    </deal-dialog>
  </div>
</template>
<script>
import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'
import DealFooter from '@/components/DealFooter'
import DealDialog from '@/components/DealDialog'

import storage from '@/util/storage'

export default {
  name: 'OrderSuccess',
  components: {
    DealHeader,
    DealContent,
    DealFooter,
    DealDialog
  },
  data() {
    return {
      showDialog: false,
      phoneNumber: ''
    }
  },
  methods: {
    toPay() {
      this.showDialog = true
    },
    cancelDialog() {
      this.showDialog = false
    },
    okDialog() {
      this.showDialog = false
    }
  },
  created() {
    this.phoneNumber = storage.get('phoneNumber')
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.vip-card-container {
  .deal-header-container {}

  .deal-content-container {
    padding: 10px;
    background-color: $greyBackground;

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

  .deal-footer-container {
    background-color: black;
    .comment,
    .add-food,
    .pay,
    {
      flex: 1;
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


