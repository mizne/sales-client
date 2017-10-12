<template>
  <div></div>
</template>
<script>
import { objFrom } from '@/util/index'
import {queryOpenid, displayOpenid} from '@/http/HongBaoJieService'
import axios from 'axios'
export default {
    created() {
      if (window.location.search) {
        const obj = objFrom(window.location.search)
        const code = obj.code

          //根据code获取微信openid用户头像
          //将openid用户头像post给会展人后台,完成后跳转到红包节界面

          //活动列表：http://dm.huizhanren.com/home/actlist/0630046f-54e0-4724-b30a-303482024be0
          //品牌总榜：http://dm.huizhanren.com/Sponsor/Index/c909ea15-bedc-4b4c-ac79-db9cd6c10862
          //我的发布：http://dm.huizhanren.com/My/PublishList/0630046f-54e0-4724-b30a-303482024be0
          //我的收藏：http://dm.huizhanren.com/My/Favorites/0630046f-54e0-4724-b30a-303482024be0
          //我的充值：http://dm.huizhanren.com/My/Pay/0630046f-54e0-4724-b30a-303482024be0
          //红包去哪了：http://dm.huizhanren.com/Home/TotalMoney/0630046f-54e0-4724-b30a-303482024be0
        queryOpenid(code).then(resp => {
          window.location.href = `http://dm.huizhanren.com/Sponsor/Index/c909ea15-bedc-4b4c-ac79-db9cd6c10862?openid=${resp.data.result.openid}`
     })
    }
   }
}
</script>
