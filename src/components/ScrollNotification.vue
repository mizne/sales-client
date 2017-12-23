<template>
  <div class="scroll-notification-container">
    <i class="icon-laba"></i>
    <div class="content-wrapper">
      <transition enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutDown">
        <div ref="content" v-show="show">{{texts[currentIndex]}}</div>
      </transition>
    </div>

  </div>
</template>
<script>
import Vue from 'vue'
export default {
  name: 'ScrollNotification',
  props: {
    texts: {
      type: Array,
      required: true
    },
    time: {
      type: Number,
      default: 5000
    }
  },
  data() {
    return {
      timeId: null,
      currentIndex: 0,
      show: true
    }
  },
  methods: {},
  created() {
    if (this.texts.length > 0) {
      this.timeId = setInterval(() => {
        this.show = false

        const index = this.currentIndex
        this.currentIndex = (index + 1) % this.texts.length

        setTimeout(() => {
          this.show = true
        }, 0)
      }, 3e3)
    }
  },
  beforeDestroy() {
    if (this.timeId) {
      clearInterval(this.timeId)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.scroll-notification-container {
  position: fixed;
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px 10px;
  background-color: #eee;
  // background-color: lighten($primaryColor, 60%);
  color: $warnColor;
  height: 30px;
  box-sizing: border-box;

  .content-wrapper {
    flex: 1;
    position: relative;
    margin-left: 5px;
    span {
      position: relative;
      color: $warnColor;
    }
  }
}

.tran {
  transition: all linear 4s;
}
</style>

