<template>
  <div class="comment-item">
    <div class="user-info">
      <div class="avatar" :style="{'background': `url(${comment.avatar}) 100% 100% no-repeat`}">
        <!--<img width="40px" :src="comment.avatar">-->
      </div>
      <div class="phone">
        {{comment.username}}
      </div>
      <div class="time">{{comment.rateTime | time}}</div>
    </div>
  
    <div class="info">
      {{comment.text}}
    </div>
  
    <div class="actions">
      <div class="thumbs-up" :class="{selected: hasThumb}" @click="thumbsUp()">
        <i class="icon-Zambia"></i>
        <span>赞</span>
      </div>
    </div>
  </div>
</template>
<script>
import fecha from 'fecha'
export default {
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      hasThumb: false
    }
  },
  filters: {
    time(v) {
      const date = new Date(v)
      return fecha.format(date, 'YYYY-MM-DD HH:mm:ss')
    }
  },
  methods: {
    thumbsUp() {
      this.hasThumb = !this.hasThumb
      this.$emit('change', this.hasThumb)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.comment-item {
  margin-top: 5px;
  border-bottom: 1px solid $greyBackground;

  .user-info {
    @include flexboxCenter;
    font-size: .8rem;

    .avatar {
      width: 40px;
      height: 40px;
      background-size: 100% !important;
      border-radius: 50%;
      margin-right: 20px;
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

      &.selected {
        color: white;
        background-color: $primaryColor;
      }
    }
  }
}
</style>
