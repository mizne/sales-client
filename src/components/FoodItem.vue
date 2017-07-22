<template>
  <li class="food-item">
    <div v-if="mode === 'picMode'" class="food-img">
      <img class="img" :src="food.image" alt="">
    </div>

    <div class="food-info" @click="showDetails">
      <div class="title">{{food.name}}</div>
      <div class="favorite">
        <i class="icon-like"></i>
        <span class="text">{{food.sellCount}}</span>
        <span class="empty" v-if="food.rest === 0">已售完</span>
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
      <span class="sub">
        <i class="icon-sub" v-show="foodCount > 0" @click="removeFood"></i>
      </span>
      <span class="food-count">
        {{foodCount > 0 ? foodCount : ''}}
      </span>
      <span class="plus">
        <i class="icon-plus" @click="addFood"></i>
      </span>
    </div>
    <div class="food-action" v-if="food.unit === '斤' && food.rest > 0" @click="showDetails">
      <span v-if="hasChoose">已点</span>
      <span v-else>请点击选择斤数/口味</span>
    </div>

  </li>
</template>
<script>
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
    foodCount() {
      if (this.$store.state.menu.tempShoppingCart[this.food.id]) {
        return this.$store.state.menu.tempShoppingCart[this.food.id].num
      }
      return 0
    },
    hasChoose() {
      return !!this.$store.state.menu.tempShoppingCart[this.food.id]
    }
  },
  methods: {
    removeFood() {
      this.$emit('remove-food')
    },
    addFood() {
      this.$emit('add-food')
    },
    showDetails() {
      this.$emit('show-detail')
    },
  },
  created() {
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
  height: 80px;

  .food-img {
    width: 80px;
    // background: url(../assets/images/default.jpg);
    // background-size: 100% 100%;
    height: 100%;
    .img {
      width: 100%;
      height: 100%;
    }
  }

  .food-info {
    flex: 3;
    /*margin-left: 5px;*/
    .title,
    .favorite,
    .price {
      margin-top: 5px;
      margin-left:5px;
    }
    .title{
      text-align:left;
    }
    .price{
      margin-bottom:5px;
    }

    .favorite,
    .price {
      display: flex;
      align-items: center;

      .icon-like {
        color: $primaryColor;
      }
      .text {
        margin-left: 5px;
        color: $primaryColor;
      }
      .empty {
        margin-left: 10px;
        color: $warnColor;
      }
    }

    .price {
      font-size: .9rem;
      .vip-text {
        margin-left: 10px;
        color: $warnColor;
      }
      .vip-price,
      .text
      {
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

      font-size: 1.3rem;
    }

    .icon-plus, .icon-sub {
      color: $primaryColor;
      font-size: 1.3rem;
    }

  }
}
</style>


