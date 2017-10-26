<template>
  <div class="shoppingcart-item">
    <div class="icon me">我</div>
    <div class="item-detail">
      <div class="food-name">{{item.name}}</div>
      <div class="food-money">
        <div class="food-price">{{isVip ? item.price : item.price}} 元/{{item.unit}}</div>
        <template v-if="item.unit === '份'
        || item.unit === '条'
        || item.unit === '瓶'
        || item.unit === '个'
        || item.unit === '盒'
        || item.unit === '块'
        || item.unit === '桶'
        || item.unit === '束'
        || item.unit === '篮'
        || item.unit === '根'
        ">
          <i v-if="isEditable" class="icon-sub" @click="editFood(item, -1)"></i>
          <div class="food-count">{{item.num}}</div>
          <i v-if="isEditable" class="icon-plus" @click="editFood(item, 1)"></i>
        </template>
        <template v-else>
          <x-number style="flex: 5;" v-if="isEditable" v-model="item.num" @on-change="editFood(item)" :min="0.1" :step="0.1"></x-number>
          <div v-else class="food-count">{{item.num}}</div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { XNumber } from 'vux'

export default {
  name: 'EShopShoppingCartItem',
  components: {
    XNumber
  },
  props: {
    item: {
      type: Object
    },
    isEditable: {
      type: Boolean,
      default: false
    },
    isVip: {
      type: Boolean
    }
  },
  methods: {
    editFood(item, offset) {
      const num = offset ? item.num + offset : item.num
      this.$emit('edit-food', {item, num})
    },
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/css/main.scss';

.shoppingcart-item {
  height: 60px;
  display: flex;
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  .icon {
    @include flexboxCenter;
    flex: 1;
    color: #fff;
    font-size: 1.2rem;
    height: 60px;
    border-radius: 10px;
  }

  .me {
    background-color: #dc5151;
  }

  .item-detail {
    flex: 4;
    padding: 0 10px;

    .food-name {
      text-align: left;
    }

    .food-money {
      display: flex;
      margin-top: 14px;
      color: #c1d0be;
      height: 27px;

      .food-price {
        flex: 3;
      }
      .food-count {
        @include flexboxCenter;
        flex: 1;
      }

      .food-price {
        text-align: left;
      }

      i {
        @include flexboxCenter;
        flex: 2;
        color: $primaryColor;
        font-size: 1.3rem;
      }
    }
  }
}
</style>

