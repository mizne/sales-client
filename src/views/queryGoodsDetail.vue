<template>
  <div class="query-goods-detail">
    <swiper :list="images" :auto="true" height="340px" dots-class="custom-bottom" dots-position="center"></swiper>
    <div class="price">
      <i class="icon-money"></i>
      <span class="normal-price">{{goodsDetail.price + '/' + goodsDetail.unit}}</span>
    </div>
    <div class="goods-introduce">
      <span class="goods-header">商品介绍</span>
      <p>{{goodsDetail.info}}</p>
    </div>
    <div class="applicable-stores">
       <h3>适用门店</h3>
       <p>地址:{{address}}</p>
    </div>
    <div class="order-confirm">
      <span class="pay-price">支付 : {{goodsDetail.price | goodsPrice}}</span>
      <span class="order-btn" @click="orderConfirm(goodsDetail.price)">确认订单</span>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { Swiper } from 'vux'
  import toPayMixin from '@/mixins/to-pay'
  import { checkBrowserForPay } from '@/util/index'
  import { WEIXIN_BROWSER } from '@/util/constants'
  export default{
      data(){
          return{
            address:''
          }
      },
    components: {
      Swiper
    },
      computed:{
        ...mapGetters(['goodsDetail']),
        images() {
          if (this.$store.state.shoppingCart.goodsDetail.image === 1) {
            return Array(3).fill({
              url: 'javascript:',
              img: this.$store.state.shoppingCart.goodsDetail.image[0] || require('../assets/images/default.jpg')
            })
          }

          if (this.$store.state.shoppingCart.goodsDetail.image.length === 3) {
            return this.$store.state.shoppingCart.goodsDetail.image.map(e => ({
              url: 'javascript:',
              img: e
            }))
          }
          else{
            return Array(3).fill({
              url: 'javascript:',
              img: this.$store.state.shoppingCart.goodsDetail.image
            })
          }
        }
      },
      created(){
          this.address = this.$store.state.shoppingCart.goodsDetail.name.split(' ')[1];
      },
      filters: {
        goodsPrice(val){
          return val = val + '元'
        }
      },
      methods:{
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
<style lang="scss">
.query-goods-detail{
  .price{
    margin-top:8px;
    margin-left:5px;
  }
  .goods-introduce{
    margin-left:5px;
    span{
      display:inline-block;
      font-size:14px;
      width:80px;
      height:25px;
      line-height:25px;
      text-align:center;
      border-radius:5px;
      background-color:#FF8004;
      color:#fff;
    }
    P{
      margin-top:5px;
      padding:5px;
      border:1px solid #cccccc;
      min-height:80px;
      font-size:14px;
      border-radius:5px;
      margin-right:5px;
    }

  }
  .applicable-stores{
    margin-left:5px;
    margin-top:5px;
    h3{
      display:inline-block;
      font-size:14px;
      width:80px;
      height:25px;
      line-height:25px;
      text-align:center;
      border-radius:5px;
      background-color:#FF8004;
      color:#fff;
    }
    P{
      font-size:14px;
      margin-top:5px;
    }
  }
  .order-confirm{
    background-color:#efefef;
    width:100%;
    height:50px;
    line-height:50px;
    /*position:absolute;*/
    /*bottom:0;*/
    margin-top:60px;
    padding-left:10px;
    box-sizing:border-box;
  .order-btn{
    background-color:#FF6D00;
    color:#fff;
    display:inline-block;
    height:100%;
    float:right;
    font-size:14px;
    width:80px;
    text-align:center;
    cursor:pointer;
  }
  }
}
</style>
