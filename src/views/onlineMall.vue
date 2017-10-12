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
        <img :src="food.image" style="width:140px;height:140px;" alt="">
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import { Alert } from 'vux'
  import { mapGetters } from 'vuex'
  import toOrderPrompt from '@/mixins/to-order-prompt'
  import {queryOrder} from '@/http/onlineMall'

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
        axios.get('https://deal.xiaovbao.cn/api/test/customer/eshop/menu?tenantId=22003000da501d8a976da9e3e680230e&consigneeId=4ee5cad6a0fa434370afd738331fbfff&qrcodeId=201710111357459483951')
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
           if(this.foodsDetail[0].todaySales <= 20) {
             this.$router.push({ name: 'onlineMallPay' });
             this.$store.commit('buyCoupon',food);
//             const foodOrder = {
//               "tableName":"0号桌",
//               "tenantId":"22003000da501d8a976da9e3e680230e",
//               "qrcodeId":"201710111357459483951",
//               "foodNum":1,
//               "foodUnit":food.unit,
//               "foodId":food.id,
//               "foodName":food.name,
//               "foodPrice":food.price,
//               "openId":"oeGC00rSlKScZMw7g9Bz3xj5hrsc",
//               "cardId":food.cardId
//             };
//             queryOrder(foodOrder).then(resp => {
//
//             })
           } else {
             this.$vux.alert.show({
               title: '',
               content: '今日已售完,敬请期待下一次'
             })
           }
       },

       showDetail(food, index) {
         if(this.foodsDetail[0].todaySales <= 2) {
           this.$router.push({ name: 'queryGoodsDetail' });
           this.$store.commit('queryDetail',food)
         } else {
           this.$vux.alert.show({
             title: '',
             content: '今日已售完,敬请期待下一次'
           })
         }
       }
     }
 }
</script>
<style lang="scss" scoped>
  @import '../assets/css/main.scss';
  .online-mall{
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
        float:right;
        img{
          border-radius:70px;
        }

      }
    }

  }
</style>
