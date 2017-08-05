<template>
  <div>
    <loading v-show="loading"></loading>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Loading from '@/components/Loading'
import QRCodeInfo from '@/models/QRCodeInfo'

export default {
  name: 'App',
  components: {
    'loading': Loading
  },
  computed: {
    ...mapGetters([
      'loading'
    ])
  },
  created() {
    // 每次从支付宝或微信 页面回来 重启应用
    // 将 tenantId 初始化到vuex中
    const tenantId = QRCodeInfo.getTenantId()
    if (tenantId) {
      this.$store.commit('SET_TENANT_ID', tenantId)
    }
  }
}
</script>
<style lang="less">
@import '~vux/src/styles/reset.less';

body {
  background-color: #fbf9fe;
}

ul,
textarea {
  margin: 0;
  padding: 0;
  border: 0;
}

li {
  list-style: none;
}
</style>
<style lang="scss">
@import './assets/css/vux-reset.scss';
</style>

