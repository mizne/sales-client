<template>
  <div class="process-bar-container">
    <div class="process-bar" ref="bar"></div>
  </div>
</template>
<script>
export default {
  name: 'ProcessBar',
  methods: {
    start() {
      const barDom = this.$refs.bar
      barDom.style.transition = 'all 1.5s ease-out'
      window.setTimeout(() => {
        barDom.style.width = '100%'
      }, 0)

      barDom.addEventListener('transitionend', () => {
        this.$emit('end')
      })
    },
  },
  mounted() {
    window.setTimeout(() => {
      this.start()
    }, 0)
  }
}
</script>
<style lang="scss" scoped>
.process-bar-container {
  width: 100%;
  height: 40px;
  background-color: #fff;
  border-radius: 5px;

  .process-bar {
    background: linear-gradient(45deg, #63e05a 25%, #7fe4a3 0, #7fe4a3 50%, #63e05a 0, #63e05a 75%, #7fe4a3 0);
    background-size: 42.4px 42.4px;
    width: 0%;
    height: 40px;
    border-radius: 5px;
  }
}
</style>


