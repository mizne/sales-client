<template>
  <div class="shoppingcart-item">
    <div class="icon me" v-if="isMe(item.tableUser)">我</div>
    <div class="icon" :class="['user-' + item.tableUserNumber, 'user']" v-else>{{item.tableUserNumber}}号</div>
    <div class="item-detail">
      <div class="food-name">{{item.name}}</div>
      <div class="food-money">
        <div class="food-price">{{isVip ? item.vipPrice : item.price}} 元/{{item.unit}}</div>
        <template v-if="item.unit === '份'">
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
import QRCodeInfo from '@/models/QRCodeInfo'

export default {
  name: 'DealShoppingCartItem',
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
    isMe(tableUser) {
      return QRCodeInfo.getTableUser() === tableUser
    },
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

  .user {
    background-color: #dc5151;
  }

  .user.user-1 {
    background-color: #20A0FF;
  }

  .user.user-2 {
    background-color: #13CE66;
  }

  .user.user-3 {
    background-color: #F7BA2A;
  }

  .user.user-4 {
    background-color: #1F2D3D;
  }

  .user.user-5 {
    background-color: #99A9BF;
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


