<template>
  <div class="onlineMall-pay">
    <div class="pay-top">
      <span class="goods-header">商品</span>
      <div class="goods-detail">
        <img :src="goodsInfo.image" alt="">
        <div class="goods-present">
          <span>{{goodsInfo.name.split(' ')[0]}}</span>
          <span>x1</span>
        </div>
        <span class="goods-price">{{goodsInfo.price | goodsPrice}}</span>
      </div>
      <div class="coupon-info">
        <h3>卡券信息:</h3>
        <p>购买成功后,系统将自动推送此券在我的卡券包内,请注意领取!</p>
      </div>
      <div class="order-confirm">
        <span class="pay-price">支付 : {{goodsInfo.price | goodsPrice}}</span>
        <span class="order-btn" @click="orderConfirm(goodsInfo.price)">确认订单</span>
      </div>
    </div>

  </div>
</template>
<script>
import {XButton} from 'vux'
import { mapGetters } from 'vuex'
import toPayMixin from '@/mixins/to-pay'
import { checkBrowserForPay } from '@/util/index'
import { WEIXIN_BROWSER } from '@/util/constants'
  export default{
    components: {
      XButton
    },
    mixins: [toPayMixin],
    data(){
      return {}
    },
    filters: {
      goodsPrice(val){
        return val = val + '元'
      }
    },
    computed: {
      ...mapGetters(['goodsInfo'])
    },
    methods: {
      orderConfirm(amount){
        const {browser, support} = checkBrowserForPay();
        localStorage.setItem('XIAO_V_BAO_AMOUNT_EPAY', amount);

        if (browser === WEIXIN_BROWSER) {
          if (support) {
            return this.$store.dispatch('Online_WECHATPAY_URL_EPAY').catch(_ => {
              vAlert({ content: '不好意思, 微信重定向地址获取失败 -_-' })
            })
          } else {
            vAlert({ content: '您的微信版本过低, 不支持支付功能, 请升级微信版本 ^_^' })
          }
        } else {
          return this.$store.dispatch('Online_ALIPAY_EPAY', amount).catch(_ => {
            vAlert({ content: '不好意思, 阿里支付请求参数获取失败 -_-' })
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../assets/css/main.scss';
  .onlineMall-pay{
      padding-top:10px;
      padding-left:10px;
      box-sizing:border-box;
    .pay-top{

      .goods-header{
        display:inline-block;
        font-size:14px;
        width:50px;
        height:30px;
        line-height:30px;
        text-align:center;
        border-radius:5px;
        background-color:#FF8004;
        color:#fff;
      }
      .goods-detail{
        margin-top:10px;
        background-color:#fff;
        padding-bottom:10px;
        padding-top:10px;
        img{
          width:80px;
          height:70px;
          vertical-align:top;
        }
        .goods-present{
          display:inline-block;
          margin-left:10px;
          span{
            display:block;
          }
        }
        .goods-price{
          float:right;
          margin-top:24px;
          margin-right:10px;
          color:#D04801;
        }
      }
      .coupon-info{
        background-color:#fff;
        margin-top:10px;
        padding:10px;
        h3{
          font-size:14px;
          font-weight:normal;
        }
        p{
          font-size:14px;
        }
      }
      .order-confirm{
        background-color:#efefef;
        width:100%;
        height:50px;
        line-height:50px;
        position:absolute;
        bottom:0;
        margin-left:-10px;
        padding-left:10px;
        box-sizing:border-box;
        .order-btn{
          background-color:#FF6D00;
          color:#fff;
          display:inline-block;
          width:80px;
          height:100%;
          float:right;
          font-size:14px;
          text-align:center;
          cursor:pointer;
          box-sizing:border-box;
        }
      }
    }

  }
</style>
