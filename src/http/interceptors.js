import axios from 'axios'
import host from './host.js'
import * as Logger from './Logger'
import storage from '@/util/storage'

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

//https://github.com/mzabriskie/axios#interceptor
;[qrcodeHttp, dealHttp, eshopHttp].forEach(http => {
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

const exceptionHandler = (module, method) => err => {
  Logger.error({
    module,
    method,
    description: `${method} failed; err: ${err.message}`
  })
  return Promise.reject(err)
}

const getBizTypeHttp = function() {
  const bizType = storage.get('bizType')
  switch (bizType) {
    case 'deal':
      return dealHttp
    case 'eshop':
      return eshopHttp
    default:
      Logger.error({
        module: 'interceptors',
        method: 'getBizTypeHttp',
        description: `Unknown biz type: ${bizType}}`
      })
  }
}

export { getBizTypeHttp, qrcodeHttp, loggerHttp, exceptionHandler }
