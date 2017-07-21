<template>
  <div class="food-detail-container">
    <deal-header title="详情">
    </deal-header>
  
    <deal-content>
      <div class="food-info">
        <div :style="{'width': '100%', 'height': '250px', 'background': `url(${foodDetail.food.image})`, 'background-size': 'contain'}">
          <!--<img style="width:100%;height:300px;" :src="foodDetail.food.image" alt="">-->
        </div>
        <div class="title">{{foodDetail.food.name}}</div>
        <div class="favorite">
          <i class="icon-like"></i>
          <span class="text">{{foodDetail.food.sellCount}}</span>
          <span class="empty" v-if="foodDetail.food.rest === 0">已售完</span>
        </div>
        <div class="price">
          <i class="icon-money"></i>
          <span class="normal-price">{{foodDetail.food.price}}/份</span>
  
          <span class="vip-text">会员:</span>
          <span class="vip-price">{{foodDetail.food.vipPrice}}/份</span>
        </div>
        <div class="addCart" v-if="foodDetail.food.unit === '斤'" @click="toggleSelection()">
          <x-button type="primary">斤数/口味</x-button>
        </div>
        <div class="addCart" v-else @click="addFood">
          <x-button type="primary" :disabled="foodDetail.food.rest === 0">加购物车</x-button>
        </div>
      </div>
      <div class="separate-lines">
      </div>
      <div class="food-comment">
        <h3>商品评价</h3>
  
        <template v-if="foodDetail.food.Ratings.length">
          <div v-for="(comment, index) in foodDetail.food.Ratings" :key="comment.$index">
            <comment-item :comment="comment" @change="changeThumbs($event, comment)"></comment-item>
          </div>
        </template>
  
        <template v-else>
          <p>这个商品还没有评论呢</p>
        </template>
  
        <div class="leave-message" v-if="hasPhoneNumber">
          <x-textarea :max="50" v-model="commentText" placeholder="说两句话吧, 您的评价和建议, 将会为我们的改进, 提供很好的参考。"></x-textarea>
          <x-button type="default" @click.native="commitComment">提交</x-button>
        </div>
      </div>
    </deal-content>
  
    <deal-footer>
      <deal-cart-bar :add-more="isAddMoreFood" :shop-cart="shoppingCart" :food-cost="tempShoppingCartFoodCost" :food-count="tempShoppingCartFoodCount" @go-shopcart="toShopCart"></deal-cart-bar>
    </deal-footer>
  
    <transition enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
      <div class="select-area" v-if="showSelection">
        <div class="food-content">
          <div class="food-title">
            <span class="food-name">{{foodDetail.food.name}}</span>
            <span class="food-old-price">
              <i class="icon-money"></i>{{foodDetail.food.oldPrice}}</span>
            <span class="food-price">
              <i class="icon-money"></i>{{foodDetail.food.price}}</span>
            <span class="cancel" @click="showSelection=false">X</span>
          </div>
  
          <div class="food-detail">
            <div class="food-quantity">
              <div class="title">
                <span class="unit">数量(斤)</span>
                <span class="remark">当日限售1000斤, 余0斤</span>
              </div>
              <div class="number-wrap">
                <input v-model.number="food.quantity">
                <!--<x-number v-model="food.quantity" :step="0.1"></x-number>-->
              </div>
            </div>
  
            <div class="food-taste">
              <div class="title">
                默认
              </div>
              <div class="content">
                <div class="row" v-for="subArr in tastes" :key="subArr.$index">
                  <div class="col" v-for="item in subArr" :key="item.$index" :class="{'selected': item.selected}" @click="item.selected=!item.selected">{{item.text}}</div>
                </div>
              </div>
            </div>
  
            <div class="food-remark">
              <div class="title">
                备注
              </div>
              <x-textarea :max="50" v-model="food.remark" placeholder="请输入您的备注。"></x-textarea>
            </div>
          </div>
        </div>
  
        <div class="food-btn" @click="addShopCart">加购物车</div>
      </div>
    </transition>
  
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import fecha from 'fecha'
import { XButton, XNumber, XTextarea } from 'vux'

import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'
import DealFooter from '@/components/DealFooter'
import CommentItem from '@//components/CommentItem'
import DealShopCartBar from '@/components/deal/ShopCartBar'

import QRCodeInfo from '@/models/QRCodeInfo'
import vipToast from '@/mixins/vip-toast'
import toShoppingCartPrompt from '@/mixins/to-shopping-cart-prompt'
import { vToast } from '@/util/vux-wrapper'

export default {
  components: {
    XButton,
    XNumber,
    XTextarea,
    DealHeader,
    DealContent,
    DealFooter,
    CommentItem,
    'deal-cart-bar': DealShopCartBar,
  },
  mixins: [vipToast, toShoppingCartPrompt],
  data() {
    return {
      hasPhoneNumber: false,
      showSelection: false,
      isDealBizType: false,
      commentText: '',
      food: {
        quantity: 1,
        remark: ''
      },
      tastes: [
        [{
          text: '麻辣',
          selected: false
        }, {
          text: '香辣',
          selected: false
        }],
        [{
          text: '剁椒',
          selected: false
        }, {
          text: '葱香',
          selected: false
        }],
        [{
          text: '双椒',
          selected: false
        }, {
          text: '蒜香',
          selected: false
        }],
        [{
          text: '酸菜',
          selected: false
        }, {
          text: '香辣豆豉',
          selected: false
        }],
        [{
          text: '五香豆豉',
          selected: false
        }, {
          text: '鱼香',
          selected: false
        }],
        [{
          text: '怪味',
          selected: false
        }, {
          text: '毛血旺',
          selected: false
        }]
      ]
    }
  },
  computed: {
    ...mapGetters([
      'foodDetail',
      'tempShoppingCart',
      'isAddMoreFood',
    ])
  },
  created() {
    this.hasPhoneNumber = QRCodeInfo.hasPhoneNumber()

    if (this.foodDetail.food.unit === '斤') {
      window.setTimeout(() => {
        this.showSelection = true
      }, 100)

      // 初始化 选中食物的 数量 remark
      const foodId = this.foodDetail.food.id
      if (this.tempShoppingCart[foodId]) {
        const { num, remark: info } = this.tempShoppingCart[foodId]
        this.food.quantity = num
        const [tasteText, remark] = info.split(/\n/)
        this.food.remark = remark
        const tasteSelected = tasteText.split(/,\s+/)
        for (let subArr of this.tastes) {
          for (let item of subArr) {
            if (tasteSelected.indexOf(item.text) >= 0) {
              item.selected = true
            }
          }
        }
      }
    }
  },
  methods: {
    toggleSelection() {
      this.showSelection = !this.showSelection
    },
    addFood() {
      this.$store.dispatch('ADD_FOOD', {
        food: this.foodDetail.food,
        typeIndex: this.foodDetail.typeIndex,
        num: 1,
        remark: ''
      })
    },
    changeThumbs(ev, comment) {
      console.log(ev, comment)
    },
    addShopCart() {
      if (this.food.quantity <= 0) {
        return this.$vux.toast.show({
          text: '必须为正数呢 ^_^',
          type: 'text',
        })
      }
      const tasteText = this.tastes.reduce((accu, curr) => {
        return accu.concat(curr)
      }, [])
        .filter(e => e.selected)
        .map(e => e.text)
        .join(', ')

      this.$store.dispatch('ADD_FOOD', {
        food: this.foodDetail.food,
        num: this.food.quantity,
        remark: `${tasteText}
          ${this.food.remark}`,
        typeIndex: this.foodDetail.typeIndex
      })

      vToast({
        content: '已添加购物车 ^_^',
      })

      this.showSelection = false
    },
    commitComment() {
      if (!this.commentText) {
        return vToast({
          content: '还没有填写呢 ^_^'
        })
      }

      const params = {
        phoneNumber: QRCodeInfo.getPhoneNumber(),
        comment: this.commentText,
        foodId: this.foodDetail.food.id,
      }
      this.$store.dispatch('ADD_FOOD_COMMENT', params)
        .then(_ => {
          this.commentText = ''
          vToast({
            content: '感谢评论 ^_^',
          })
        })
    }
  },
  created() {
    this.isDealBizType = QRCodeInfo.isDealBizType()
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.food-detail-container {
  .deal-header-container {}

  .deal-content-container {
    overflow: auto;
    .food-info {
      position: relative;

      .title,
      .favorite,
      .price {
        display: flex;
        margin-left: 5px;
        margin-top: 5px;
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
        .vip-text,
        .vip-price {
          color: #f00;
        }
        .vip-text {
          margin-left: 10px;
        }
      }
      .addCart {
        display: flex;
        position: absolute;
        right: 20px;
        bottom: -5px;
      }
    }


    .separate-lines {
      margin-top: 15px;
      width: 100%;
      background-color: $greyBackground;
      height: 10px;
    }

    .food-comment {
      border-bottom: 1px solid $greyBackground;
      padding: 0 10px;
      h3 {
        text-align: left;
        margin-left: 10px;
        margin-top: 10px;
        font-weight: 500;
        font-size: 18px;
        margin-bottom: 10px;
      }

      .rating-item {
        margin-top: 5px;
        border-bottom: 1px solid $greyBackground;

        .user-info {
          @include flexboxCenter;

          .avatar {
            width: 40px;
          }
          .phone,
          .rating,
          .time {
            flex: 1;
          }

          .icon-star {
            &.on {
              color: $primaryColor;
            }
          }
        }

        .info {
          padding-top: 10px;
          min-height: 50px;
          text-align: left;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          padding: 5px 0;

          .thumbs-up {
            width: 50px;
            height: 25px;
            border: 1px solid $greyText;
            border-radius: 5px;
            margin-right: 40px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            font-size: 1rem;

            .selected {
              color: $primaryColor;
            }
          }
        }
      }

      .leave-message {
        margin-top: 20px;

        .text-area {
          width: 100%;
          height: 100px;
          padding: 10px;
          box-sizing: border-box;
        }
      }
    }
  }

  .deal-footer-container {
    background-color: black;
  }

  .select-area {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 330px;
    z-index: 100;
    background-color: $greyBackground;
    border-top: 1px solid #aaa;
    overflow: overlay;
    padding-bottom: 40px;

    .food-content {
      padding: 0 10px;

      .food-title {
        @include flexboxCenter;
        height: 50px;
        border-bottom: 1px solid #aaa;
        .food-name {
          flex: 3;
        }
        .food-old-price,
        .food-price {
          flex: 1;
          margin-left: 5px;
        }


        .food-name {
          font-weight: 600;
        }
        .food-old-price {
          color: #aaa;
          text-decoration: line-through;
        }
        .food-price {
          color: red;
        }
        .cancel {
          flex: 1;
          margin-left: 80px;
          color: #aaa;
          transform: scale(1.3);
        }
      }

      .food-detail {
        margin-top: 10px;

        .food-quantity {
          .title {
            .unit {
              font-weight: 600;
            }
            .remark {
              color: #aaa;
              font-size: .9rem;
            }
          }

          .number-wrap {
            margin-top: 5px;
            display: flex;
            .number {
              flex: 1;
              border: 1px solid #aaa;
              border-radius: 4px;
              text-align: center;
              font-weight: 600;

              input {
                border: none;
                height: 100%;
                padding: 0 10px;
                box-sizing: border-box;
              }
            }
            .placeholder {
              flex: 1;
              margin-left: 10px;
            }
          }
        }

        .food-taste {
          margin-top: 10px;

          .title {
            font-weight: 600;
          }

          .content {
            .row {
              margin-top: 5px;
              display: flex;

              .col {
                flex: 1;
                text-align: center;
                border: 1px solid #aaa;
                border-radius: 4px;

                &:last-child {
                  margin-left: 10px;
                }

                &.selected {
                  background-color: $primaryColor;
                  color: white;
                }
              }
            }
          }
        }

        .food-remark {
          margin-top: 10px;
          .title {
            font-weight: 600;
          }
          .text-area {
            width: 100%;
            padding: 5px;
            border: 1px solid #aaa;
            box-sizing: border-box;
          }
        }
      }
    }

    .food-btn {
      position: absolute;
      width: 100%;
      height: 40px;
      background-color: $primaryColor;
      color: white;
      text-align: center;
      line-height: 40px;
    }
  }
}
</style>
