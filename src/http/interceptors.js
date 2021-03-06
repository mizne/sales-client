import axios from 'axios'
import host from '../../config/host.js'
import QRCodeInfo from '@/models/QRCodeInfo'

const qrcodeHttp = axios.create({
  baseURL: host.qrcode,
  timeout: 10000
})
const dealHttp = axios.create({
  baseURL: host.deal,
  timeout: 10000
})
const eshopHttp = axios.create({
  baseURL: host.eshop,
  timeout: 10000
})

const epayHttp = axios.create({
  baseURL: host.epay,
  timeout: 10000
})

const ipayHttp = axios.create({
    baseURL: host.ipay,
    timeout: 10000
  })

//https://github.com/mzabriskie/axios#interceptor
;[qrcodeHttp, dealHttp, eshopHttp, epayHttp, ipayHttp].forEach(http => {
  http.interceptors.request.use(
    function(config) {
      return config
    },
    function(error) {
      console.error(error)
      return Promise.reject(error)
    }
  )
  http.interceptors.response.use(
    // 检查后台返回格式 {resCode: Number, resMsg: String, result: any}
    // 如 resCode 不为0 则reject
    function(resp) {
      if (resp.data.hasOwnProperty('resCode')) {
        if (resp.data.resCode === 0) {
          return resp.data.result
        } else {
          return Promise.reject(new Error(resp.data.result))
        }
      } else {
        return Promise.reject(new Error(`server resp format incorrect; has no resCode field; resp: ${JSON.stringify(resp.data)}`))
      }
    },
    function(error) {
      return Promise.reject(new Error(error))
    }
  )
})

const loggerHttp = axios.create({
  baseURL: host.logger,
  timeout: 10000
})

loggerHttp.interceptors.request.use(
  // 开发环境 不上传 error-logger
  function(config) {
    if (process.env.NODE_ENV === 'development') {
      return Promise.reject(new Error('development not need report to server'))
    }
    return config
  },
  function(error) {
    console.error(error)
    return Promise.reject(error)
  }
)
loggerHttp.interceptors.response.use(
  // 检查后台返回格式 {resCode: Number, resMsg: String, result: any}
  // 如 resCode 不为0 则reject
  function(resp) {
    if (resp.data.hasOwnProperty('resCode')) {
      if (resp.data.resCode === 0) {
        return resp.data.result
      } else {
        return Promise.reject(new Error(resp.data.resMsg))
      }
    } else {
      return Promise.reject(
        new Error('server resp format error, has no resCode field')
      )
    }
  },
  function(error) {
    return Promise.reject(new Error(error))
  }
)

export { dealHttp, eshopHttp, epayHttp, ipayHttp, qrcodeHttp, loggerHttp }
