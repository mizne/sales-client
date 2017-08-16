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
import ShopItem from '@/components/ShopItem'
import QRCodeInfo from '@/models/QRCodeInfo'
import toTenant from '@/mixins/to-tenant'

export default {
  name: 'RecommendArea',
  mixins: [toTenant],
  components: {
    ShopItem
  },
  data() {
    return {
      shops: []
    }
  },
  created() {
    const allTenants = QRCodeInfo.getTenants()
    this.shops = allTenants.filter((_, i) => i % 2 === 0)
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

