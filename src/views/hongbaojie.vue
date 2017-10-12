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
        //return code
        queryOpenid(code).then(resp => {
          window.location.href = `http://dm.huizhanren.com/home/actlist/0d05035c-599f-437c-820e-a6eb009b4e3d?openid=${resp.data.result.openid}`
     })
    }
   }
}
</script>
