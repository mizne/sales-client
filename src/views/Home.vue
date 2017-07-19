<template>
  <div class="home-container" :style="homeStyle">
  
    <group class="phone" label-width="4.5em" label-margin-right="2em" label-align="right">
      <cell title="全国统一客服热线" value="025-86662644"></cell>
    </group>
    <footer class="footer">
      <router-link to="/menu">
        <i class="icon-edit"></i>
        <div class="text">去点餐</div>
      </router-link>
      <router-link to="/shop-comment-view">
        <i class="icon-comment"></i>
        <div class="text">商家评价</div>
      </router-link>
    </footer>
  </div>
</template>
<script>
import { Group, Cell } from 'vux'
import { mapGetters } from 'vuex'

import { objFrom } from '@/util/index'
import { vAlert, vToast } from '@/util/vux-wrapper'
import storage from '@/util/storage'

export default {
  name: 'Home',
  components: {
    Group,
    Cell
  },
  computed: {
    ...mapGetters(['hasClosed', 'homeImage', 'tenantName']),
    homeStyle() {
      return {
        'background': `url(${this.homeImage}) no-repeat`,
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    
    next(vm => {
      // 从 首页进来 初始化状态及配置信息
      // 从 其他页面后退进来 不作初始化请求 让其直接进入home页
      if (from.path === '/') {
        const { QRCodeTemplateId: qrcodeId } = objFrom(window.location.search)
        if (!qrcodeId) {
          return vAlert({ content: '二维码错误' })
        }
        vm.$store.dispatch('FETCH_QRCODE_INFO', qrcodeId)
          .then(_ => {

            vm.$store.dispatch('FETCH_TENANT_CONFIG')
              .then(_ => {
                if (vm.hasClosed) {
                  vAlert({
                    content: '啊哦, 店铺已打烊, 只能看不能买了, 明天再来吧 ^_^'
                  })
                }

                document.title = vm.tenantName
              })

            vm.$store.dispatch('FETCH_USER_STATUS')
              .then(status => {
                // 通过桌状态 路由页面
                // 空桌 可领取优惠券
                if (status.tableStatus === 0) {// 空桌
                  vm.$router.push({ name: 'Home' })
                  
                  if (storage.has('couponType')) {
                    vm.$store.dispatch('RECEIVE_COUPON')
                  }
                } else if (status.tableStatus === 1) {// 已下购物车
                  vm.$router.push({ name: 'ShoppingCart' })
                } else if (status.tableStatus === 2) {// 已下单
                  vm.$router.push({ name: 'OrderSuccess' })
                } else {
                  console.error(`Unknown table status; status: `, status.tableStatus)
                  vm.$router.push({ name: 'Home' })
                }
              })

            vm.$store.dispatch('FETCH_AVALIABLE_COUPONS')
              .then(coupons => {
                if (coupons.length > 0) {
                  vToast({
                    content: `恭喜您, 您有 ${coupons.length} 张可用优惠券, 在订单页面可查看 ^_^`,
                    position: 'top'
                  })
                }
              })
          })
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
  background-size: 100% 100% !important;

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

    display: flex;

    a {
      display: inline-block;
      flex: 1;
      text-decoration: none;
      color: black;

      &:first-child {
        border-right: 1px solid black;
      }
      &:last-child {
        border-left: 1px solid black;
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


