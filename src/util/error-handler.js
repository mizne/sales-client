import { Logger } from '@/http/index'

window.onerror = function (msg, url, col, line, error) {
  window.setTimeout(() => {
    Logger.info({
      module: 'main',
      method: 'window.onerror',
      description: `msg: ${msg}; col: ${col}; line: ${line};`
    })
  })

  return true
}