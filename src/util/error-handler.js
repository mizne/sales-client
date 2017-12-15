import Logger from './error-logger'

if (process.env.NODE_ENV === 'production') {
  window.onerror = function(msg, url, col, line, error) {
    window.setTimeout(() => {
      Logger.info({
        module: 'main',
        method: 'window.onerror',
        description: `msg: ${msg}; col: ${col}; line: ${line};`
      })
    })

    console.error(msg)
    return true
  }
}
