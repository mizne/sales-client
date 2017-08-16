<template>
  <div class="main-page">
    <div class="head-content" :style="{'background-image': 'url('+ industryImage + ')'}">
      <!-- <span>
        <img style="width:100%;height:40%;" src="../assets/images/dinning.jpg">
      </span> -->
      <div class="top-pointer">{{industryLabel}}</div>
    </div>
  
    <template v-if="shops.length > 0">
      <div class="shops">
        <shop-item v-for="shop in shops" :key="shop.id" :shop="shop" @to-shop="toTenant"></shop-item>
      </div>
    </template>
    <template v-else>
      <p class="no-shops">商家正在上线中, 敬请期待</p>
    </template>
  
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

import ShopItem from '@/components/ShopItem'
import { vAlert } from '@/util/vux-wrapper'
import QRCodeInfo from '@/models/QRCodeInfo'

export default {
  name: 'IndustryHome',
  components: {
    ShopItem
  },
  computed: {
    ...mapGetters(['industryLabel', 'tenantName', 'hasClosed', 'needDeliveryFee'])
  },
  data() {
    return {
      shops: [],
      industryImage: null
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
    this.industryImage = require(`../assets/images/${this.industryLabel}.jpg`)
    const allTenants = QRCodeInfo.getTenants()
    this.shops = allTenants.filter(e => e.industry === this.$route.params.name)
  }
}
</script>
<style lang="scss">
@import '../assets/css/main.scss';

.main-page {
  .head-content {
    position: relative;
    width: 100%;
    height: 200px;
    background-size: cover;
    background-image: url(../assets/images/dinning.jpg);

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
    background-color: $greyBackground;
  }

  .no-shops {
    margin-top: 100px;
    text-align: center;
  }
}
</style>
