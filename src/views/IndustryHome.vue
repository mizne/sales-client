<template>
  <div class="main-page">
    <div class="head-content">
      <span>
        <img style="width:100%;height:40%;" src="../assets/images/dinning.jpg">
      </span>
      <div class="top-pointer">{{industryLabel}}</div>
    </div>
  
    <template v-if="shops.length > 0">
      <ul class="shops">
        <li v-for="item in shops" class="shop" :key="item.$index" @click="toTenant(item)">
          <div class="img-wrapper">
            <img :src="item.homeImage" alt="">
          </div>
          <span class="shop-label">{{item.name}}</span>
        </li>
      </ul>
    </template>
    <template v-else>
      <p class="no-shops">商家正在上线中, 敬请期待</p>
    </template>
  
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { vAlert } from '@/util/vux-wrapper'
import QRCodeInfo from '@/models/QRCodeInfo'

export default {
  name: 'IndustryHome',
  computed: {
    ...mapGetters(['industryLabel', 'tenantName', 'hasClosed', 'needDeliveryFee'])
  },
  data() {
    return {
      shops: []
    }
  },
  methods: {
    toTenant(item) {
      this.$store.commit('SET_TENANT_ID', item.id)
      this.$store.commit('SET_TABLE_NAME', item.tableName)

      this.$store.dispatch('FETCH_TENANT_CONFIG')
        .then(_ => {
          if (this.hasClosed) {
            vAlert({
              content: '啊哦, 店铺已打烊, 只能看不能买了, 明天再来吧 ^_^'
            })
          }
          document.title = this.tenantName

          // 代售业务且商户有经纬度才获取 配送费
          if (this.needDeliveryFee) {
            this.$store.dispatch('FETCH_DELIVERY_FEE')
          }
        })
        .then(_ => {
          this.$router.push({ name: 'Menu' })
        })

    }
  },
  created() {
    const allTenants = QRCodeInfo.getTenants()
    this.shops = allTenants.filter(e => e.industry === this.$route.params.name)
  }
}
</script>
<style lang="scss">
.main-page {
  .head-content {
    position: relative;
    .top-pointer {
      width: 100%;
      height: 4rem;
      line-height: 4rem;
      font-size: 2rem;
      background-color: rgba(121, 121, 121, 0.8);
      font-weight: 500;
      color: #fff;
      padding-left: 20px;
      position: absolute;
      bottom: 0;
    }
  }
  .shops {
    width: 100%;
    .shop {
      display: inline-block;
      width: 25%;
      margin-top: 4rem;
      text-align: center;
      a {
        font-size: 2rem;
        text-decoration: none;
        color: #fff;
        cursor: pointer;
      }
      .img-wrapper {
        display: block;
        width: 60px;
        height: 60px;
        text-align: center;
        border-radius: 60px;
        background-color: #8DAD6C;
        margin: 0.5rem auto;
        img {
          position: relative;
          width: 60px;
          height: 60px;
        }
      }
    }
  }

  .no-shops {
    margin-top: 100px;
    text-align: center;
  }
}
</style>
