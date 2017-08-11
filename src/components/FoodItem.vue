<template>
  <li class="food-item" @click="showDetails">
    <div v-if="mode === 'picMode'" class="food-img">
      <img class="img" :src="food.image" alt="">
    </div>
  
    <div class="food-detail">
      <div class="title">{{food.name}}</div>
  
      <div class="description">
        <div class="food-info">
          <div class="favorite">
            <i class="icon-like"></i>
            <span class="text">{{food.sellCount}}</span>
            <span class="rest" v-if="food.rest > 0">还剩 {{food.rest + food.unit}}</span>
            <span class="empty" v-if="food.rest === 0">已售完</span>
            <span class="coupon" v-if="food.coupon">{{food.coupon}}</span>
          </div>
          <div class="price">
            <i class="icon-money"></i>
            <span class="normal-price">{{food.price}}/{{food.unit}}</span>
  
            <div v-if="needVip">
              <span class="vip-text">会员:</span>
              <span class="vip-price">{{food.vipPrice}}/{{food.unit}}</span>
            </div>
          </div>
        </div>
        <div class="food-action" v-if="(food.unit === '份' || food.unit === '条' || food.unit === '瓶' || food.unit === '个' || food.unit === '盒' || food.unit === '块' || food.unit === '桶') && food.rest > 0">
          <span class="sub" @click="removeFood">
            <i class="icon-sub" v-show="foodCount > 0"></i>
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
  margin-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid $greyText;
  height: 70px;
  font-size: .6rem;

  .food-img {
    width: 60px; // background: url(../assets/images/default.jpg);
    // background-size: 100% 100%;
    height: 100%;
    .img {
      width: 100%;
      height: 100%;
    }
  }

  .food-detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    .title {
      font-size: .8rem;
      margin-left: 10px;
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
          margin-left: 5px;

          .icon-like {
            color: $primaryColor;
          }
          .text {
            margin-left: 5px;
            color: $primaryColor;
          }
          .rest {
            margin-left: 5px;
            color: $primaryColor;
          }
          .empty {
            margin-left: 10px;
            color: $warnColor;
          }

          .coupon {
            border: 1px solid $warnColor;
            padding: 0 5px;
            margin-left: 5px;
            color: $warnColor;
          }
        }

        .price {
          margin-top: 5px;
          margin-left: 5px;
          margin-bottom: 5px;
          display: flex;
          align-items: center;
          font-size: .7rem;
          .vip-text {
            margin-left: 10px;
            color: $warnColor;
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


