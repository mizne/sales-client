<<template>
  <div class="recommend-area">
    <div class="title">
      <span class="before">-</span>
      <span class="text">猜你喜欢</span>
      <span class="after">-</span>
    </div>

    <div class="shops">
      <shop-item v-for="shop in shops" :key="shop.$index" :shop="shop"></shop-item>
    </div>
  </div>
</template>
<script>
import ShopItem from '@/components/ShopItem'

export default {
  name: 'RecommendArea',
  components: {
    ShopItem
  },
  data() {
    return {
      shops: [
        {
          name: '老乡鸡',
          img: require('../assets/logo.png'),
          description: '起送价20元|配送费3元',
          sellCountPerMonth: '185',
          promotions: '满15减8, 满20减12'
        },
        {
          name: '谐众千百味',
          img: require('../assets/logo.png'),
          description: '起送价29元|配送费3元',
          sellCountPerMonth: '1850',
          promotions: '满15减8, 满200减12'
        }
      ]
    }
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

