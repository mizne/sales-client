<template style="height:100%">
  <div class="online-mall">
    <div class="food" v-for="(food,index) in foodsDetail">
      <div class="food-detail">
        <div class="food-name">{{food.name.split(' ')[0]}}</div>
        <div class="food-introduce">{{food.info}}</div>
        <span class="food-price">{{food.price | price}}</span>
        <div class="food-link">
          <span @click="showDetail(food,index)">查看详情</span>
          <span @click="toBuyNow(food,index)">立即购买</span>
        </div>
      </div>

      <div class="food-img">
        <img :src="food.image" style="width:160px;height:160px;" alt="">
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import { mapGetters } from 'vuex'
  import toOrderPrompt from '@/mixins/to-order-prompt'

 export default{
     data() {
       return {
           foods:[],
           foodsDetail:[],
           food: {
             quantity: 1,
             remark: ''
           }
       }
     },
   computed: {
//     ...mapGetters(['shoppingCart', 'needChoosePeopleNumberPage','foodDetail','tempShoppingCart','isAddMoreFood'])
   },
     mixins: [toOrderPrompt],
     created() {
        axios.get('https://deal.xiaovbao.cn/api/test/customer/eshop/menu?tenantId=22003000da501d8a976da9e3e680230e&consigneeId=4ee5cad6a0fa434370afd738331fbfff&qrcodeId=201708312100381153263')
          .then(resp => {
              this.foods = resp.data.result;
              this.foods.forEach(e => {
                  this.foodsDetail.push(...e.foods);
              })
          })
     },
     filters: {
         price(val){
             return val = '¥ ' + val;
         }
     },
     methods: {
       toBuyNow(food,index) {
           this.$router.push({ name: 'onlineMallPay' });
           this.$store.commit('buyCoupon',food);
       },

       showDetail(food, index) {
         this.$router.push({ name: 'queryGoodsDetail' });
         this.$store.commit('queryDetail',food)
       }
     }
 }
</script>
<style lang="scss" scoped>
  @import '../assets/css/main.scss';
  .online-mall{
     /*display:flex;*/
     /*justify-content:center;*/
     /*align-items:center;*/

    .food{
      display:block;
      width:90%;
      height:180px;
      padding:10px;
      /*border:1px solid #ccc;*/
      background:url('../assets/images/backCoupon.png');
      margin-top:20px;
      margin-left:10px;
      position:relative;
        &:after{
           display:block;
           content:"clear";
           clear:both;
           line-height:0;
           visibility:hidden;

         }
      .food-detail{
        float:left;
        .food-name{
          font-size:24px;
          margin-bottom:5px;
          color:#D04801;
        }
        .food-price{
          font-size:28px;
          font-weight:bold;
          color:#D04801;
          position:absolute;
          bottom:40px;
        }
        .food-link{
          font-size:14px;
          position:absolute;
          bottom:10px;
          cursor:pointer;
          left:40px;
          span{
            border-bottom:1px solid #333;
            margin-right:20px;
          }
        }
      }
      .food-img{
        float:left;
        position:absolute;
        right:10%;
        top:10%;
        img{
          border-radius:80px;
        }

      }
    }

  }
</style>
