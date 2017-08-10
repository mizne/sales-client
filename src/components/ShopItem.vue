<<template>
  <div class="shop-item">
    <div class="image" :style="{'background-image': 'url('+ shop.img + ')'}"></div>

    <div class="detail">
      <div class="label">
        {{shop.name}}
      </div>
      <div class="description">
        {{shop.description}}
      </div>
      <div class="info">
        <div class="promotions">{{shop.promotions}}</div>
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
    @include flexboxCenter;

    flex-direction: column;
    .label,
    .description,
    .info {
      width: 100%;
    }

    .label,
    .description {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    .description {
      margin-top: 5px;
      font-size: .8rem;
      color: $greyText;
    }

    .info {
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .promotions {
        font-size: .8rem;
        color: $primaryColor
      }
      .sell-count {
        color: $greyText;
        font-size: .9rem;
      }
    }
  }
}
</style>


