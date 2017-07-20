<template>
  <iframe :src="alipayUrl"></iframe>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Alipay',
  computed: {
    ...mapGetters(['alipayUrl'])
  }
}
</script>
<style lang="scss" scoped>
iframe {
  border: none;
  width: 100%;
  height: 100vh;

  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>



