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
}
</style>



