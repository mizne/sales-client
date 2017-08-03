<template>
  <div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { objFrom } from '@/util/index'
import QRCodeInfo from '@/models/QRCodeInfo'

export default {
  name: 'Home',
  components: {

  },
  computed: {
    ...mapGetters([
    ])
  },
  methods: {
    getQrcodeId() {
      if (window.location.search) {
        const obj = objFrom(window.location.search)
        const qrcodeId = obj.QRCodeTemplateId || obj.id
        return qrcodeId
      } else {
        return QRCodeInfo.getQrcodeId()
      }
    }
  },
  created() {
    // 获取二维码信息判断是否酒店总二维码 是否跳转入口
    const qrcodeId = this.getQrcodeId()

    this.$store.dispatch('FETCH_QRCODE_INFO', qrcodeId)
      .then(_ => {
        if (QRCodeInfo.hasTenants()) {
          this.$router.push({ name: 'MultiTenantHome' })
        } else {
          this.$router.push({ name: 'SingleTenantHome' })
        }
      })
  }
}
</script>
<style lang="scss">
@import '../assets/css/vux-reset.scss';
</style>

