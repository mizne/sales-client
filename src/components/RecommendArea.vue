<<template>
  <div class="recommend-area">
    <div class="title">
      <span class="before">-</span>
      <span class="text">猜你喜欢</span>
      <span class="after">-</span>
    </div>

    <div class="shops">
      <shop-item v-for="shop in shops" :key="shop.$index" :shop="shop" @to-shop="toTenant"></shop-item>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

import ShopItem from '@/components/ShopItem'
import QRCodeInfo from '@/models/QRCodeInfo'
import toTenant from '@/mixins/to-tenant'
import { not } from '@/util/index'

export default {
  name: 'RecommendArea',
  mixins: [toTenant],
  components: {
    ShopItem
  },
  computed: {
    ...mapGetters(['tenants'])
  },
  data() {
    return {
      shops: []
    }
  },
  created() {
    const isOpen = e => e.openFlag
    const randomShops = this.tenants.filter((_, i) => i % 2 === 0)
    this.shops = [...randomShops.filter(isOpen), ...randomShops.filter(not(isOpen))]
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';
.recommend-area {
  margin-top: 20px;
  .title {
    text-align: center;
    color: $greyText;
    height: 30px;
    line-height: 30px;
    font-size: .9rem;
    background-color: $whiteBackground;
  }

  .shops {
    
  }
}
</style>

