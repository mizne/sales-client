<<template>
  <div class="shop-item" @click="toShop(shop)">
    <div class="image" :style="{'background-image': 'url('+ shop.homeImage + ')'}"></div>

    <div class="detail">
      <div class="title">
        <span class="name">{{shop.name}}</span>
        <span class="distance">{{shop.distance | distanceFilter}}</span>
      </div>
      <div class="description">
        <span class="text">{{shop.description}}</span>
        <span class="close" v-if="shop.close">商家休息</span>
      </div>
      <div class="info">
        <div class="promotions">{{shop.officialNews}}</div>
        <div class="sell-count">月售{{shop.sellCountPerMonth}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ShopItem',
  props: {
    shop: {
      type: Object
    }
  },
  filters: {
    distanceFilter(v) {
      if (typeof v === 'string') {
        return v
      }

      if (v < 1000) {
        return `${v} m`
      }

      return (v / 1000).toFixed(2) + ' km'
    }
  },
  methods: {
    toShop(shop) {
      this.$emit('to-shop', shop)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.shop-item {
  @include flexboxCenter;
  height: 80px;
  background-color: $whiteBackground;
  padding: 10px 10px;
  border-top: 1px solid $greyText;

  .image {
    width: 80px;
    height: 100%;
    background-size: 100% 100%;
  }

  .detail {
    margin-left: 10px;
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: baseline;
    flex-direction: column;

    .title,
    .description,
    .info {
      width: 100%;
    }

    .title,
    .description {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    .description {
      margin-top: 5px;
      font-size: .8rem;
      color: $greyText;

      .text {
        @include textOverflow;
        width: 70%;
      }
      .close {
        width: 30%;
        color: $warnColor;
      }
    }

    .title {
      .name {
        @include textOverflow;
        width: 70%;
      }
      .distance {
        width: 30%;
        font-size: .8rem;
      }
    }

    .info {
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .promotions {
        @include textOverflow;
        flex: 4;
        font-size: .8rem;
        color: $primaryColor
      }
      .sell-count {
        flex: 1;
        color: $greyText;
        font-size: .8rem;
      }
    }
  }
}
</style>


