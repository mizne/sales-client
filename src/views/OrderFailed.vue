<template>
  <div class="order-failed-container">
    <deal-header title="下单失败">
      <span class="empty" slot="left" style="width: 40px;">
      </span>
    </deal-header>
  
    <deal-content>
      <div class="tip">
        <div class="fail">
          <i class="icon-fail"></i>
        </div>
  
        <div class="desc">
          <span class="text">抱歉, 由于服务器原因, 下单失败了, 请重新下单</span>
        </div>
      </div>
    </deal-content>
  
    <deal-footer>
      <div class="comment" @click="reAddOrder()">
        <i class="icon-comment"></i>
        <span class="text">重新下单</span>
      </div>
    </deal-footer>
  </div>
</template>
<script>
import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'
import DealFooter from '@/components/DealFooter'

export default {
  name: 'OrderSuccess',
  components: {
    DealHeader,
    DealContent,
    DealFooter,
  },
  methods: {
    reAddOrder() {
      this.$store.dispatch('ADD_ORDER')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';
.order-failed-container {
  .deal-header-container {}

  .deal-content-container {
    padding: 10px;
    background-color: $greyBackground;

    .tip {
      margin-top: 25px;
      font-size: 1rem;

      .fail {
        @include flexboxCenter;
        i {
          color: red;
          transform: scale(2);
        }
      }

      .desc {
        @include flexboxCenter;
        .text {
          margin-top: 20px;
        }
      }
    }
  }

  .deal-footer-container {
    .comment {
      flex: 1;
      background: $primaryColor;
    }
  }
}
</style>


