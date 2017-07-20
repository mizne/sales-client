<template>
  <transition enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutUp">
    <i class="icon-uptop" v-show="show" @click="handleBackTop">
    </i>
  </transition>
</template>
<script>
export default {
  name: 'BackTop',
  data() {
    return {
      show: false,
      timer: ''
    }
  },
  mounted() {
    document.addEventListener('scroll', this.handleToggle)
  },
  beforeDestroy() {
    document.removeEventListener('scroll', this.handleToggle)
  },
  methods: {
    handleToggle() {
      const y = document.body.scrollTop || document.documentElement.scrollTop
      if (y > 100) {
        this.show = true
      } else {
        this.show = false
      }
    },
    handleBackTop() {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        const now = document.body.scrollTop || document.documentElement.scrollTop
        if (now === 0 ) {
          clearInterval(this.timer)
          return
        }
        const speed = Math.floor(-now / 10)

        document.body.scrollTop = document.documentElement.scrollTop = now + speed
      }, 15)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';
.icon-uptop {
  position: fixed;
  right: 10px;
  bottom: 80px;
  font-size: 5rem !important;
  color: $primaryColor;
  z-index: 100;
  cursor: pointer;
}
</style>