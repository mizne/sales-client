<template>
  <div class="menu-container">
    <deal-dialog class="menu-dialog" v-model="showMenu" dialog-enter-active="animated fadeInLeft" dialog-leave-active="animated fadeOutLeft">
      <li class="menu-item" @click="choose('picMode')">
        <i class="icon-iconfontlist"></i>
        <span class="text">有图模式</span>
      </li>
      <li class="menu-item" @click="choose('noPicMode')">
        <i class="icon-ban"></i>
        <span class="text">无图模式</span>
      </li>
    </deal-dialog>
  
    <deal-header title="菜单">
      <span class="menu" slot="left">
        <i class="icon-menu" @click="show"></i>
      </span>
    </deal-header>
  
    <deal-content>
      <scroll-notification :texts="officialNews"></scroll-notification>
      <div class="left-tab">
        <ul class="dish-type-container">
          <li class="dish-type" :class="{'selected': menuCurrentIndex === index}" @click="selectFoodType(item, index)" v-for="(item, index) in allFoods" :key="item.id">
            <span class="text">{{item.name}}</span>
            <div class="food-count" v-if="item.selectFoodCount">{{item.selectFoodCount || ''}}</div>
          </li>
        </ul>
      </div>
  
      <div class="right-content" ref="foodsWrapper">
        <li class="food-type-container" v-for="(subFoods, index) in allFoods" :key="subFoods.id">
          <div class="food-type-title" :class="{selected: index === menuCurrentIndex}">{{subFoods.name}}</div>
          <food-item v-for="food in subFoods.foods" :key="food.id" :mode="showMode" :need-vip="needVipToast" :food="food" :type-index="index" @add-food="addFood(food, index)" @remove-food="removeFood(food, index)" @show-detail="showDetail(food,index)">
          </food-item>
        </li>
      </div>
    </deal-content>
  
    <deal-footer>
      <deal-cart-bar :add-more="isAddMoreFood" :shop-cart="shoppingCart" :food-cost="tempShoppingCartFoodCost" :food-count="tempShoppingCartFoodCount" @go-shopcart="toShopCart"></deal-cart-bar>
    </deal-footer>
  
    <back-top></back-top>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { XButton } from 'vux'

import DealDialog from '@/components/DealDialog'
import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'
import DealFooter from '@/components/DealFooter'
import BackTop from '@/components/BackTop'
import FoodItem from '@/components/FoodItem'
import DealShopCartBar from '@/components/deal/ShopCartBar'
import ScrollNotification from '@/components/ScrollNotification'

import vipToast from '@/mixins/vip-toast'
import toShoppingCartPrompt from '@/mixins/to-shopping-cart-prompt'
import { createSteps } from '@/util/index'
import { vToast } from '@/util/vux-wrapper'
import QRCodeInfo from '@/models/QRCodeInfo'

export default {
  name: 'Menu',
  components: {
    XButton,
    DealDialog,
    DealHeader,
    DealContent,
    DealFooter,
    BackTop,
    FoodItem,
    'deal-cart-bar': DealShopCartBar,
    ScrollNotification,
  },
  mixins: [vipToast, toShoppingCartPrompt],
  data() {
    return {
      showMenu: false,// 是否显示左上角的menu
      listHeight: [],// 菜单右边菜品子列表的高度
      foodsScrollY: 0,// 菜单右边滚动区的 滚动y轴偏差
      menuCurrentIndex: 0,// 菜单左边 当前选中索引,
    }
  },
  computed: {
    ...mapGetters([
      'allFoods',
      'isAddMoreFood',
      'showMode',
      'needVipToast',
      'officialNews'
    ])
  },
  watch: {
    foodsScrollY(v) {
      for (let i = 0, l = this.listHeight.length; i < l; i++) {
        let topHeight = this.listHeight[i]
        let bottomHeight = this.listHeight[i + 1]
        if (!bottomHeight || (this.foodsScrollY >= topHeight && this.foodsScrollY < bottomHeight)) {
          this.menuCurrentIndex = i
          return
        }
      }
      this.menuCurrentIndex = 0
    },
  },
  methods: {
    addFood(food, typeIndex) {
      this.$store.dispatch('ADD_FOOD', {
        food,
        typeIndex,
        num: 1,
        remark: ''
      })
    },
    removeFood(food, typeIndex) {
      this.$store.dispatch('REMOVE_FOOD', {
        food,
        typeIndex,
        num: 1,
        remark: ''
      })
    },
    showDetail(food, typeIndex) {
      this.$router.push({ name: 'FoodDetail' })
      this.$store.commit('SET_FOOD_DETAIL', {
        food,
        typeIndex,
      })
    },
    choose(mode) {
      this.showMenu = false
      this.$store.commit('SET_SHOW_MODE', mode)
    },
    show() {
      this.showMenu = !this.showMenu
    },
    selectFoodType(foodType, index) {
      this.menuCurrentIndex = index
      this._scrollFoods(index)
    },
    _scrollFoods(index) {
      // clearInterval(this._timer)
      // const steps = createSteps(this.foodsScrollY, this.listHeight[index], 10)

      // this._timer = setInterval(() => {
      //   const step = steps.shift()
      //   if (steps.length === 0) {
      //     clearInterval(this._timer)
      //   }
      //   window.scrollTo(0, step)
      // }, 1)
  
      window.scrollTo(0, this.listHeight[index])
    },
    _initAllFoods() {
      return this.$store.dispatch('FETCH_ALL_FOODS')
        .catch(err => {
          vToast({
            content: '啊哦, 网络似乎出问题了, 稍后请重试下 ^_^',
          })
        })
        .then(_ => {
          Vue.nextTick(() => {
            this._initScroll()// 初始化scrollListener
            this._calcHeight()// 初始化不同品种菜列表 的高度
            this._initRectTop()// 初始化 菜品滚动区的视口top
          })
        })

    },
    _initScroll() {
      document.addEventListener('scroll', this._scrollListener)
    },
    _destroyScroll() {
      document.removeEventListener('scroll', this._scrollListener)
    },
    _scrollListener() {
      const rect = this.$refs.foodsWrapper.getBoundingClientRect()
      const scrollY = -(rect.top - this._rectTop)
      this.foodsScrollY = scrollY
    },
    _calcHeight() {
      const foodsList = this.$refs.foodsWrapper.querySelectorAll('.food-type-container')
      let height = 0
      this.listHeight.push(height)
      for (let list of foodsList) {
        height += list.offsetHeight
        this.listHeight.push(height)
      }
    },
    _initRectTop() {
      this._rectTop = this.$refs.foodsWrapper.getBoundingClientRect().top
    }
  },
  mounted() {
    this._initAllFoods()
  },
  beforeDestroy() {
    this._destroyScroll()
  },
}
</script>
<style lang="scss">
// 不加scoped 因为需要覆盖 deal-dialog组件的style
@import '../assets/css/main.scss';

.menu-container {
  .deal-dialog-container.menu-dialog {

    .deal-dialog {
      position: fixed;
      top: 40px;
      left: 0;
      width: 200px;
      transform: none;
      color: #313131;
      background-color: #fff;
      transition: all .3s ease;
      z-index: 5000;

      .menu-item {
        @include flexboxCenter;
        margin: 5px;
        padding: 5px;

        &:first-child {
          border-bottom: 1px solid #715151;
        }
        .text {
          margin-left: 15px;
        }
      }
    }
  }

  .deal-header-container {
    .menu {
      width: 44px;
    }
    .search {
      width: 44px;
    }
  }

  .deal-content-container {
    .left-tab {
      position: fixed;
      top: 65px;
      left: 0;
      bottom: 40px;
      width: 80px;
      border-right: 1px solid $greyText;
      overflow: overlay;

      .dish-type-container {
        position: relative;
        .dish-type {
          @include flexboxCenter;
          height: 45px;
          font-size: .9rem;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid $greyText;
          text-align: center;
          cursor: pointer;

          .food-count {
            @include flexboxCenter;
            position: absolute;
            left: 54px;
            top: 7px;
            line-height: 14px;
            padding: 1px 0;
            color: #111;
            background-color: $primaryColor;
            text-align: center;
            border-radius: 50%;
            font-size: 12px;
            width: 18px;
            height: 18px;
          }

          &.selected {
            color: $primaryColor;
          }
        }
      }
    }

    .right-content {
      position: absolute;
      top: 35px;
      left: 80px;
      width: calc(100% - 90px);
      padding: 0 5px 40px 5px;

      .food-type-container {
        text-align: left;
        border-bottom: 10px solid lighten($primaryColor, 50%);
        .food-type-title {
          display: flex;
          align-items: center;
          background-color: lighten($primaryColor, 50%);
          height: 30px;
          padding-left: 5px;
        }

        .selected {
          font-weight: 600;
        }
      }
    }
  }

  .deal-footer-container {
    background-color: black;
  }
}
</style>


