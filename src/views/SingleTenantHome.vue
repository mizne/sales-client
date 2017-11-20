<template>
  <div class="home-container">
    <div class="background" @click="toMenu()" :style="homeStyle">
      <!-- <div class="attention">
        <p class="animated swing">关注领红包</p>
        <a :href="ATTENTION_HREF"><img :src="attentionPng" alt=""></a>
      </div> -->
    </div>

    <group class="phone" label-width="4.5em" label-margin-right="2em" label-align="right">
      <cell title="电话号码" :value="tenantPhone"></cell>
    </group>

    <footer class="footer">
      <div class="item">
        <router-link to="/menu">
          <div class="text">去{{bizTypeText}}</div>
        </router-link>
      </div>
      <div class="item">
        <router-link to="/shop-comment-view">
          <div class="text">商家评价</div>
        </router-link>
        <router-link to="/mine">
          <div class="text">我的</div>
        </router-link>
      </div>
    </footer>
  </div>
</template>
<script>
import { Group, Cell, Popover} from 'vux'
import { mapGetters } from 'vuex'

import { ATTENTION_HREF } from '@/util/constants'
import { objFrom } from '@/util/index'
import { vAlert, vToast } from '@/util/vux-wrapper'
import QRCodeInfo from '@/models/QRCodeInfo'
import { EMPTY_STATUS, SHOPPING_CART_STATUS, ORDER_SUCCESS_STATUS } from '@/util/constants'

export default {
  name: 'Home',
  components: {
    Group,
    Cell,
    Popover
  },
  data() {
    return {
        bizTypeText: '' ,
        attentionPng: 'static/image/icon-attention.png',
        ATTENTION_HREF
    }
  },
  methods: {
    toAttention() {
      console.log('dianji ')
      window.location.href = ATTENTION_HREF
    },
    toMenu() {
      this.$router.push({ name: 'Menu' })
    }
  },
  computed: {
    ...mapGetters(['hasClosed', 'homeImage', 'tenantName', 'needDeliveryFee', 'tenantPhone']),
    homeStyle() {
      return {
        'background': `url(${this.homeImage})  no-repeat `,
      }
    },
  },
  created() {
    this.bizTypeText = QRCodeInfo.getBizTypeText()
    document.title = QRCodeInfo.getDocumentTitle()
  },
  beforeRouteEnter(to, from, next) {

    next(vm => {
      // 从 首页进来 初始化状态及配置信息
      // 从 其他页面后退进来 不作初始化请求 让其直接进入home页
      if (from.name === 'Home') {
        // 获取商户配置信息
        vm.$store.dispatch('FETCH_TENANT_CONFIG')
          .then(_ => {
            if (vm.hasClosed) {
              vAlert({
                content: '啊哦, 店铺已打烊, 只能看不能买了, 明天再来吧 ^_^'
              })
            }
            document.title = vm.tenantName
            // 代售业务且商户有经纬度才获取 配送费
            if (vm.needDeliveryFee) {
              vm.$store.dispatch('FETCH_DELIVERY_FEE')
            }
          })

        // 获取当前用户状态
        vm.$store.dispatch('FETCH_USER_STATUS')
          .then(([status, coupons]) => {
            // 通过桌状态 路由页面W
            // 空桌 可领取优惠券
            if (status.tableStatus === EMPTY_STATUS) {// 空桌
              vm.$router.push({ name: 'SingleTenantHome' })

              // 可以领取优惠券
              if (QRCodeInfo.hasCoupons()) {
                vm.$store.dispatch('RECEIVE_COUPON')
              }
            } else if (status.tableStatus === SHOPPING_CART_STATUS) {// 已下购物车
              vm.$router.push({ name: 'ShoppingCart' })
            } else if (status.tableStatus === ORDER_SUCCESS_STATUS) {// 已下单
              vm.$router.push({ name: 'OrderSuccess' })
            } else {
              console.error(`Unknown table status; status: `, status.tableStatus)
              vm.$router.push({ name: 'SingleTenantHome' })
            }

            if (coupons.length > 0) {
              vToast({
                content: `恭喜您, 您有 ${coupons.length} 张优惠券 ^_^`,
                position: 'top'
              })
            }
          })
      } else {
        vm.bizTypeText = QRCodeInfo.getBizTypeText()
      }
    })
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';
.home-container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  .background {
    position:relative;
    height: calc(100% - 103px);
    /*background:url('static/image/backgroundImag.jpg');*/
    background-size: 100% 100% !important;
    .attention{
      position:absolute;
      bottom:0;
      right:5%;
      z-index:1000;
    P{
      animation-iteration-count: 3;
      color:#fff;
      font-size:14px;
      padding:5px;
      border-radius:5px;
      background:red;
      margin-left:5px;
    }
    a{
        position:relative;
        left:30px;
      img{
        width:45px;
        height:45px;
        color:#fff;
        background-color:#FFBC03;
        border-radius:50%;
      }
    }
    }

  }

  .phone {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 63px;
  }



  /*background: url(../assets/images/lashangyin-home1.png) no-repeat;
  background-size: 100% 93%;*/
  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    padding: 5px 0;
    background-color: $greyBackground;
    height: 50px;
    display: flex;

    .item {
      @include flexboxCenter;
      flex: 1;

      &:first-child {
        a {
          color: white;
        }
        background-color: $warnColor; // border-right: 1px solid black;
      }
      &:last-child {
        // border-left: 1px solid black;
      }
      a {
        @include flexboxCenter;
        display: inline-block;
        flex: 1;
        text-decoration: none;
        color: black;
        .text {
          flex: 1;
        }
      }
    }
  }
}
</style>

<style lang="scss">
@import '../assets/css/main.scss';
.phone {
  .weui-cells {
    background-color: $greyBackground !important;
  }
}
</style>


