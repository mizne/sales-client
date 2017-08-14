<template>
  <div class="order-item" @click="toDetail(order)">
    <div class="abstract">
      <div class="title">
        <div class="merchant">{{order.merchantName}} ></div>
        <div class="time">{{order.time | ago}}</div>
      </div>
      <div class="status" :class="{'uncomplete': order.status !== 2}">
        {{order.status | orderStatus}}
      </div>
    </div>

    <div class="food-description">
      {{order.foods | foodDesc}}
    </div>
    <div class="price" v-if="order.status === 2">
      <i class="icon-money"></i>
      {{order.actualAmount}}
    </div>
  </div>
</template>
<script>
import Coupon from '@/models/Coupon'
import fecha from 'fecha'
import { timeago } from '@/util/index'

export default {
  name: 'OrderItem',
  props: {
    order: {
      type: Object
    },
  },
  filters: {
    orderStatus(v) {
      const map = {
        0: '订单未完成',
        1: '订单待支付',
        2: '订单已完成'
      }
      return map[v]
    },
    ago(v) {
      const [ymd, hms] = v.split(/\s+/)
      const [year, month, day] = ymd.split('-')
      const [hour, minute, second] = hms.split(':')
      return timeago(new Date(year, month - 1, day, hour, minute, second))
    },
    foodDesc(foods) {
      const name = foods[0].name
      const desc = foods.length > 1 ? '等' : ''
      return `${name} ${desc}${foods.length}件商品`
    }
  },
  methods: {
    toDetail(item) {
      this.$emit('to-detail', item)
    }
  },
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.order-item {
  margin: 5px 0;
  padding: 10px 10px;
  background-color: white;
  height: 110px;
  

  .abstract {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      .time {
        color: $greyText;
      }
    }
    .status {
      
    }
    .uncomplete {
      color: $warnColor;
    }
  }

  .food-description {
    margin-top: 10px;
  }

  .price {
    .icon-money {
      font-size: .9rem;
    }
  }
}
</style>


