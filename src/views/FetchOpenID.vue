<template>
  <div class="image-container">
    <img src="../assets/images/loading.gif">
  </div>
</template>
<script>
import { WechatService } from '@/http/index'
import { objFrom } from '@/util/index'
import { vToast } from '@/util/vux-wrapper'

export default {
  name: 'FetchOpenID',
  created() {
    const obj = objFrom(decodeURIComponent(location.search))

    WechatService.getOpenId(obj.code)
      .then(openid => {
        vToast({ type: 'success', content: '提取成功, 感谢配合 ^_^' })
      })
      .catch(err => {
        vToast({ type: 'cancel', content: '提取失败, 麻烦重试一次 ^_^' })
      })
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/main.scss';

.image-container {
  @include flexboxCenter;
}
</style>


