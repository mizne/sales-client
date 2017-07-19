<template>
  <div class="shopping-cart-container">
    <deal-header title="购物车">
      <x-button slot="left" @click.native="addMoreFood" :mini="true" type="primary">继续加菜</x-button>
    </deal-header>
  
    <deal-content>
      <div class="table-info">
        <span class="table-number">桌号: {{shoppingCart.tableName}}</span>
        <span class="food-count">合计: {{shoppingCart.totalNum}}份</span>
        <span class="food-cost">
          <i class="icon-money"></i>
          <span>{{shoppingCart.totalPrice}}</span>
        </span>
      </div>
  
      <div class="order-list">
        <template v-if="shoppingCart.foods.length > 0">
          <swipeout>
            <div v-for="item in shoppingCart.foods" :key="item.$index">
              <swipeout-item transition-mode="follow">
                <div slot="right-menu">
                  <swipeout-button @click.native="deleteFood(item)" type="warn">删除</swipeout-button>
                </div>
                <div slot="content">
  
                  <template v-if="isDealBizType">
                    <deal-item :is-editable="isEditable" :is-vip="isVip" :item="item" @edit-food="editFood"></deal-item>
                  </template>
                  <template v-else>
                    <eshop-item :is-editable="isEditable" :is-vip="isVip" :item="item" @edit-food="editFood"></eshop-item>
                  </template>
  
                  <div class="food-remark" v-if="item.unit === '斤'" style="padding: 10px;">
                    <p>备注： {{item.remark}}</p>
                  </div>
                </div>
              </swipeout-item>
            </div>
          </swipeout>
        </template>
        <template v-else>
          <div class="order-tip">
            <i class="icon-tip"></i>
            <span class="text">您还未点菜哟 ^_^</span>
          </div>
        </template>
  
      </div>
  
      <div class="delivery" v-if="!isDealBizType">
        <span class="delivery-label">配送费:</span>
        <span class="delivery-placeholder"></span>
        <span class="delivery-value">
          <i class="icon-money"></i>
          <span>{{deliveryFee}}</span>
        </span>
      </div>
      
      <div class="remark">
        <x-textarea :max="50" v-model="remark" :placeholder="remarkPlaceholder"></x-textarea>
      </div>
    </deal-content>
  
    <deal-footer>
      <div class="left-area" @click="refreshOrder">
        <i class="icon-refresh"></i>
        <span class="text">刷新</span>
      </div>
      <div class="center-area" @click="editOrder">
        <i class="icon-pencil"></i>
        <span class="text">修改</span>
      </div>
      <div class="right-area" @click="ensureOrder">
        <i class="icon-order"></i>
        <span class="text">下单</span>
      </div>
    </deal-footer>
  
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Swipeout, SwipeoutItem, SwipeoutButton, XNumber, Group, XButton, XTextarea, PopupRadio } from 'vux'


import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'
import DealFooter from '@/components/DealFooter'
import EShopShoppingCartItem from '@/components/eshop/ShoppingCartItem'
import DealShoppingCartItem from '@/components/deal/ShoppingCartItem'

import storage from '@/util/storage'
import { vAlert, vToast } from '@/util/vux-wrapper'
import { DEAL } from '@/util/constants'
import toOrderPrompt from '@/mixins/to-order-prompt'

export default {
  name: 'ShoppingCart',
  components: {
    DealHeader,
    DealContent,
    DealFooter,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    XNumber,
    Group,
    PopupRadio,
    XButton,
    XTextarea,
    'eshop-item': EShopShoppingCartItem,
    'deal-item': DealShoppingCartItem
  },
  mixins: [toOrderPrompt],
  data() {
    return {
      isEditable: false,
      remark: '',
      isDealBizType: false,
      remarkPlaceholder: ''
    }
  },
  computed: {
    ...mapGetters([
      'shoppingCart',
      'isVip',
      'deliveryFee'
    ]),
  },
  methods: {
    addMoreFood() {
      this.$store.dispatch('ADD_MORE_FOOD')
    },
    refreshOrder() {
      this.$store.dispatch('FETCH_SHOPPING_CART')
    },
    editOrder() {
      this.isEditable = !this.isEditable
    },
    editFood({ item, num }) {
      const params = {
        foodId: item.id,
        foodCount: num,
      }
      if (this.isDealBizType) {
        params.tableUser = item.tableUser
      }
      this.$store.dispatch('EDIT_SHOPPING_CART', params)
    },
    deleteFood(food) {
      const params = {
        foodId: food.id,
        foodCount: 0
      }
      if (this.isDealBizType) {
        params.tableUser = food.tableUser
      }
      this.$store.dispatch('EDIT_SHOPPING_CART', params)
    },
    _init() {
      this.isDealBizType = storage.get('bizType') === DEAL

      this.remarkPlaceholder = this.isDealBizType
        ? '请填写备注'
        : '该订单为代售商品, 如收货地址变更, 请填写具体地址, 默认为本二维码所在地址'
    }
  },
  created() {
    this._init()
    this.$store.dispatch('FETCH_SHOPPING_CART')
      .catch(err => {
        vToast({ content: '啊哦, 获取购物车失败, 请重试下 ^_^' })
      })
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';
.shopping-cart-container {
  .deal-header-container {}

  .deal-content-container {
    padding: 10px;
    background-color: $greyBackground;

    .table-info {
      @include flexboxCenter;
      height: 40px;
      margin-top: 10px;
      background-color: #fff;
      text-align: center;
      border-radius: 5px;
      .table-number,
      .food-count,
      .food-cost {
        flex: 1;
      }

      .food-cost {
        color: $primaryColor;
      }
    }



    .order-list {
      margin-top: 10px;



      .order-item:not(:first-child) {
        margin-top: 1px;
      }

      .order-tip {
        @include flexboxCenter;
        color: $primaryColor;
        background-color: #fff;
        height: 200px;
        border-radius: 5px;

        .icon-tip {
          transform: scale(1.5);
          margin-top: 6px;
        }
        .text {
          margin-left: 10px;
        }
      }
    }

    .delivery {
      @include flexboxCenter;
      height: 40px;
      margin-top: 10px;
      background-color: #fff;
      text-align: center;
      border-radius: 5px;
      .delivery-label,
      .delivery-placeholder,
      .delivery-value {
        flex: 1;
        @include flexboxCenter;
      }

      .delivery-value {
        color: $primaryColor;
      }
    }


    .remark {
      margin-top: 10px;
      margin-bottom: 50px;
      div#placeholder {
        color: #ff8f00;
      }
    }
  }

  .deal-footer-container {
    .left-area,
    .center-area,
    .right-area {
      @include flexboxCenter;
      flex: 1;
      span {
        margin-left: 10px;
      }
    }

    .left-area,
    .center-area {
      color: #fff;
      background-color: #000;
    }

    .right-area {
      color: #fff;
      background-color: $warnColor;
    }
  }
}
</style>


