<template>
  <div class="shop-comment-view-container">
    <deal-header :title="title">
    </deal-header>
  
    <deal-content>
      <div class="total-ratings">
        <rating :title="totalTitle" v-model="totalRating"></rating>
      </div>
  
      <div class="ratings-list">
        <div class="title">
          <span>全部评价</span>
        </div>
  
        <div class="content">
          <template v-if="shopComments.length">
            <div class="rating-item" v-for="(comment, index) in shopComments" :key="comment.$index">
              <div class="user-info">
                <div class="avatar" :style="{'background': `url(${comment.avatar}) 100% 100% no-repeat`}">
                  <!--<img width="40px" :src="comment.avatar">-->
                </div>
                <div class="phone">
                  <span>{{comment.userName}}</span>
                  <i class="icon-star" v-for="(item, starIndex) in 5" :key="item.$index" :class="{'on': starIndex < comment.averageScore}"></i>
                </div>
                <div class="time">{{comment.createdAt | time}}</div>
              </div>
  
              <div class="info">
                {{comment.text}}
              </div>
  
              <div class="actions">
                <div class="thumbs-up" @click="thumbsUp(index)" :class="{selected: selectedIndexes.indexOf(index) >= 0}">
                  <i class="icon-Zambia"></i>
                  <span>赞</span>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <p>还没有客户评价呢 ：)</p>
          </template>

        </div>
      </div>
    </deal-content>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

import DealHeader from '@/components/DealHeader'
import DealContent from '@/components/DealContent'
import DealFooter from '@/components/DealFooter'
import Rating from '@/components/Rating'

import fecha from 'fecha'

export default {
  name: 'ShopCommentView',
  components: {
    DealHeader,
    DealContent,
    DealFooter,
    Rating
  },
  computed: {
    ...mapGetters(['shopComments']),
    title() {
      if (this.shopComments) {
        return '商家评价(' + this.shopComments.length + ')'
      } else {
        return '商家评价'
      }
    }
  },
  filters: {
    time(v) {
      const date = new Date(v)
      return fecha.format(date, 'YYYY-MM-DD HH:mm')
    }
  },
  data() {
    return {
      totalTitle: '总体评价',
      totalRating: 4.4,
      selectedIndexes: []
    }
  },
  methods: {
    thumbsUp(index) {
      const i = this.selectedIndexes.indexOf(index)
      if (i >= 0) {
        this.selectedIndexes.splice(i, 1)
      } else {
        this.selectedIndexes.push(index)
      }
    }
  },
  created() {
    // 计算 totalRating
    this.$store.dispatch('FETCH_SHOP_COMMENT')
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.shop-comment-view-container {
  .deal-header-container {}

  .deal-content-container {
    padding: 0 0 10px 0;
    background-color: $greyBackground;

    .total-ratings {
      background-color: white;
    }

    .ratings-list {
      margin-top: 20px;
      background-color: white;
      padding: 0 10px;
      .title {
        padding: 10px 0;
        border-bottom: 1px solid $greyBackground;
      }

      .content {
        @include flexboxCenter;
        min-height: 50px;

        .rating-item {
          margin-top: 5px;
          border-bottom: 1px solid $greyBackground;

          .user-info {
            @include flexboxCenter;

            .avatar {
              width: 40px;
              height: 40px;
              background-size: 100% !important;
              border-radius: 50%;
              margin-right: 20px;
            }
            .phone,
            .time {
              flex: 1;
            }

            .icon-star {
              color: #aaa;
              &.on {
                color: #86b201;
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

              &.selected {
                background-color: #86b201;
                color: white;
              }
            }
          }
        }
      }
    }
  }
}
</style>


