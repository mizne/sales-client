import { WEIXIN_BROWSER, ALI_BROWSER, UNKNOWN_BROWSER } from './constants'

const createSteps = (start, end, range = 10) => {
  if (start > end) {
    return createSteps(end, start, range).reverse()
  }
  const maxIndex = Math.floor(end / range)
  const minIndex = Math.ceil(start / range)

  const originalSteps = Array.from(
    { length: maxIndex + 1 },
    (_, i) => i * range
  )

  return [start, ...originalSteps.slice(minIndex, maxIndex + 1), end]
}

// 将url中search提取成obj
// ?a=12&b=11&a=89 => {a: [12, 89], b: 11}
const objFrom = function(search) {
  if (!search) {
    return {}
  }

  const arr = search.slice(1).split('&')
  return arr.reduce((accu, curr) => {
    const [key, val] = curr.split('=')
    if (accu[key]) {
      if (typeof accu[key] === 'string') {
        accu[key] = [accu[key], val]
      } else if (Array.isArray(accu[key])) {
        accu[key] = [...accu[key], val]
      }
    } else {
      accu[key] = val
    }

    return accu
  }, {})
}

// 判断 当前时间 是否在开门和打烊时间之间
// begin: 9:00  end: 18:30
const dateBetween = function(begin, end) {
  const [beginHour, beginMinute] = begin.split(':')
  const [endHour, endMinute] = end.split(':')
  const now = new Date()
  const nowMilliseconds = now.getTime()

  const year = now.getFullYear()
  const month = now.getMonth()
  const day = now.getDate()

  const startTime = new Date(year, month, day, beginHour, beginMinute).getTime()
  const endTime = new Date(year, month, day, endHour, endMinute).getTime()

  return startTime < nowMilliseconds && nowMilliseconds < endTime
}

// 函数 取反
const not = function(fn) {
  return function(...args) {
    return !fn(...args)
  }
}

// 检查浏览器版本 是否适用于支付
const checkBrowserForPay = function() {
  const ua = navigator.userAgent
  const match = ua.match(/micromessenger\/(\d)/i)
  if (match) {
    if (Number(match[1]) >= 5) {
      // 微信版本大于等于5 才支持支付功能
      return {
        browser: WEIXIN_BROWSER,
        support: true
      }
    } else {
      return {
        browser: WEIXIN_BROWSER,
        support: false
      }
    }
  } else if (ua.indexOf('AlipayClient') >= 0) {
    // 支付宝浏览器
    return {
      browser: ALI_BROWSER,
      support: true
    }
  } else {
    // 非 微信/支付宝 浏览器 用阿里支付
    return {
      browser: UNKNOWN_BROWSER,
      support: true
    }
  }
}

export { createSteps, objFrom, dateBetween, not, checkBrowserForPay }
