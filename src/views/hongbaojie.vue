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
        alert("code:" + code);
        //根据code获取微信openid用户头像
        //将openid用户头像post给会展人后台,完成后跳转到红包节界面
        //return code
        queryOpenid(code).then(resp => {
            alert("返回结果" + JSON.stringify(resp.data))
           const OpenId = resp.data.result.OpenId
//              OpenId:
//              Headimgurl:
//              nickname:
//           return displayOpenid(OpenId).then(resp => {
//              if(resp.data.resCode === 0){
//                 window.location.href = `http://dm.huizhanren.com/home/actlist/0d05035c-599f-437c-820e-a6eb009b4e3d?openid=${OpenId}`
//              } else {
//                  return ''
//              }
//          })
        }
        )
      }
    }
}
</script>
