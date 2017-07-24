import Vue from 'vue'
import { AlertPlugin, ConfirmPlugin } from 'vux'

Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)

const vConfirm = function({ title = '提示', content = '小v宝 友情提醒' }) {
  return new Promise((resolve, reject) => {
    Vue.$vux.confirm.show({
      title,
      content,
      onConfirm() {
        resolve('ok')
      },
      onCancel() {
        reject(`cancel confirm; content: ${content}`)
      }
    })
  })
}

const vAlert = function({
  title = '提示',
  content = '小v宝 友情提醒, 出错啦 -_-',
  buttonText = '朕知道了'
}) {
  return new Promise((resolve, reject) => {
    Vue.$vux.alert.show({
      title,
      content,
      buttonText,
      onHide() {
        resolve('close')
      }
    })
  })
}

const vToast = function({
  content = '小v宝 友情提醒',
  type = 'text',
  time = 3e3,
  position = 'default'
}) {
  return Vue.$vux.toast.show({
    type,
    text: content,
    time,
    position
  })
}

export { vConfirm, vAlert, vToast }
