<template>
  <li class="food-item" @click="showDetails">
    <div v-if="mode === 'picMode'" class="food-img">
      <img class="img" style="width: 100%; height: 100%;" v-lazy="food.image[0]" alt="">
    </div>

    <div class="food-detail">
      <div class="title">
        <div class="name">{{food.name}}</div>
        <div class="coupon" v-if="food.coupon">{{food.coupon}}</div>
        <div class="coupon" v-if="food.goodsPromotion">{{food.goodsPromotion.purchaseLimit === -1 ? '优惠不限份数' : '每单限'+food.goodsPromotion.purchaseLimit+'份优惠'}}</div>
      </div>

      <div class="description">
        <div class="food-info">
          <div class="favorite">
            <!-- <i class="icon-like"></i> -->
            <span class="title-text">已售</span>
            <span class="text">{{food.sellCount}}</span>
            <span class="rest" v-if="food.rest > 0">还剩 {{food.rest + food.unit}}</span>
            <span class="empty" v-if="food.rest === 0">已售完</span>
            <i class="icon-Zambia" v-if="food.Ratings.length > 0"></i>
            <span class="zambia-count" v-if="food.Ratings.length > 0">{{food.Ratings.length}}</span>

          </div>
          <div class="price">
            <i class="icon-money"></i>
            <span class="normal-price">{{food.price}}/{{food.unit}}</span>

            <div v-if="food.goodsPromotion">
              <span class="vip-text">活动价:</span>
              <span class="vip-price">{{food.goodsPromotion.activityPrice}}/{{food.unit}}</span>
            </div>
            <!--<div v-if="needVip">
                <span class="vip-text">会员价:</span>
                <span class="vip-price">{{food.vipPrice}}/{{food.unit}}</span>
              </div> -->
          </div>
        </div>
        <div class="food-action" v-if="(food.unit === '份'
        || food.unit === '条'
        || food.unit === '瓶'
        || food.unit === '个'
        || food.unit === '盒'
        || food.unit === '块'
        || food.unit === '桶'
        || food.unit === '束'
        || food.unit === '篮'
        || food.unit === '根'
        || item.unit === '套'
        || item.unit === '罐'
        || item.unit === '件'
        || item.unit === '对'
        ) && food.rest > 0">
          <span class="sub" v-if="foodCount > 0" @click="removeFood">
            <i class="icon-sub"></i>
          </span>
          <span class="food-count">
            {{foodCount > 0 ? foodCount : ''}}
          </span>
          <span class="plus" @click="addFood">
            <i class="icon-plus"></i>
          </span>
        </div>
        <div class="food-action" v-if="food.unit === '斤' && food.rest > 0" @click="showDetails">
          <span v-if="hasChoose">已点</span>
          <span v-else style="font-size: .7rem">点击选择斤数/口味</span>
        </div>
      </div>
    </div>

  </li>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'FoodItem',
  props: {
    food: {
      type: Object,
      required: true
    },
    mode: {
      type: String
    },
    typeIndex: {
      type: Number,
      required: true
    },
    needVip: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  computed: {
    ...mapGetters(['tempShoppingCart']),
    foodCount() {
      if (this.tempShoppingCart[this.food.id]) {
        return this.tempShoppingCart[this.food.id].num
      }
      return 0
    },
    hasChoose() {
      return !!this.tempShoppingCart[this.food.id]
    },
    backgroundStyle() {
      return {
        'background-image': `url(${this.food.image}) !important`
      }
    }
  },
  methods: {
    removeFood(ev) {
      ev.stopPropagation()
      this.$emit('remove-food')
    },
    addFood(ev) {
      ev.stopPropagation()
      this.$emit('add-food')
    },
    showDetails() {
      this.$emit('show-detail')
    },
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.food-item {
  display: flex;
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #EEE;
  height: 70px;
  font-size: .6rem;

  .food-img {
    width: 65px;
    height: 65px;
    background: center center no-repeat;
    background-size: cover; // background-image: url(../assets/images/default.jpg);
  }

  .food-detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-left: 10px;

    .title {
      font-size: .8rem;
      display: flex;

      .name {
        @include textOverflow;
        max-width: 160px;
      }

      .coupon {
        @include flexboxCenter;
        border: 1px solid $warnColor;
        padding: 0 5px;
        margin-left: 5px;
        color: $warnColor;
      }
    }

    .description {
      display: flex;

      .food-info {
        flex: 3;
        font-size: .8rem;
        /*margin-left: 5px;*/
        .favorite {
          display: flex;
          align-items: center;
          margin-top: 5px;

          .icon-like {
            color: #777;
          }
          .title-text {
            color: #777;
          }
          .text {
            margin-left: 5px;
            color: #777;
          }
          .rest {
            margin-left: 5px;
            color: #777;
          }
          .empty {
            margin-left: 10px;
            color: $warnColor;
          }
          i {
            font-size: .9rem;
            color: #777;
            margin-left: 5px;
          }
          .zambia-count {
            margin-left: 5px;
            color: #777;
          }
        }

        .price {
          margin-top: 5px;
          margin-bottom: 5px;
          display: flex;
          align-items: center;
          font-size: .7rem;
          .vip-text {
            margin-left: 10px;
            color: $warnColor;
          }
          .icon-money {
            font-size: .7rem;
          }
          .vip-price,
          .text {
            color: $warnColor;
          }
        }
      }

      .food-action {
        flex: 1;
        padding-top: 25px;
        display: flex;

        .sub,
        .food-count,
        .plus {
          flex: 1;
          @include flexboxCenter;

          font-size: 1.1rem;
        }

        .icon-plus,
        .icon-sub {
          color: $primaryColor;
          font-size: 1.1rem;
        }
      }
    }
  }
}
</style>


