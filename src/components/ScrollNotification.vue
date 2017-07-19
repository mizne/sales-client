<template>
  <div class="scroll-notification-container">
    <i class="icon-laba"></i>
    <div class="content-wrapper">
      <span ref="content">{{text}}</span>
    </div>
  
  </div>
</template>
<script>
import Vue from 'vue'
export default {
  name: 'ScrollNotification',
  props: {
    text: {
      type: String,
      required: true
    },
    time: {
      type: Number,
      default: 5000
    }
  },
  data() {
    return {
      timeId: null
    }
  },
  methods: {},
  mounted() {
    this.$refs.content.style.left = "100%"
    // this.$refs.content.style.transform = "translateX(110%)"
    this.$refs.content.classList.toggle('tran')
    window.setTimeout(() => {
      this.$refs.content.style.left = '0'
      // this.$refs.content.style.transform = "translateX(-110%)"
    }, 0)

    this.timeId = window.setInterval(() => {
      this.$refs.content.style.left = "100%"
      // this.$refs.content.style.transform = "translateX(110%)"
      this.$refs.content.classList.toggle('tran')

      window.setTimeout(() => {
        this.$refs.content.style.left = "0"
        // this.$refs.content.style.transform = "translateX(-110%)"
        this.$refs.content.classList.toggle('tran')
      }, 0)
    }, this.time)
  },
  beforeDestroy() {
    window.clearInterval(this.timeId)
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
  background-color: lighten($primaryColor, 60%);
  color: $warnColor;

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
 
