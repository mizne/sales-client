import Vue from 'vue'
import { AlertPlugin, ConfirmPlugin, ToastPlugin } from 'vux'

Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(ToastPlugin)

const vConfirm = function({ title = '提示', content = '躺着买 友情提醒', confirmText, cancelText }) {
  return new Promise((resolve, reject) => {
    Vue.$vux.confirm.show({
      title,
      content,
      confirmText,
      cancelText,
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
  content = '躺着买 友情提醒, 出错啦 -_-',
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
  content = '躺着买 友情提醒',
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
