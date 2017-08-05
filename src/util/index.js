import { WEIXIN_BROWSER, ALI_BROWSER, UNKNOWN_BROWSER } from './constants'
import fecha from 'fecha'

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

// date: Date
// 返回 date的 多少时间前的描述
// 譬如 5秒前、40分钟前、3小时14分钟前
// 如 超过1天 则返回时间描述格式 YYYY-MM-DD HH:mm
const timeago = function (date) {
  const now = new Date().getTime()
  const d = date.getTime()
  const diff = now - d
  if (diff < 0) {
    throw new Error(`date must before now; date: ${date}`)
  } 
  const oneSecond = 1 * 1000
  const oneMinute = 60 * oneSecond
  const oneHour = 60 * oneMinute
  const oneDay = 24 * oneHour

  if (diff < oneMinute) {
    return `${Math.floor(diff / oneSecond)}秒前`
  }

  if (diff < oneHour) {
    return `${Math.floor(diff / oneMinute)}分钟前`
  }

  if (diff < oneDay) {
    const hours = Math.floor(diff / oneHour)
    const minutes = Math.floor( (diff % oneHour)/oneMinute )

    return `${hours}小时${minutes}分钟前`
  }

  return fecha.format(date, 'YYYY-MM-DD HH:mm')
}

// duration: week, month, year
// 生成时间间隔
// [startTime, endTime]
// startTime: 一周前, 一月前, 一年前
// endTime: 现在
const generateBetweenDate = function (duration) {
  const now = new Date().getTime()
  let startTime
  const endTime = fecha.format(new Date(now), 'YYYY/MM/DD HH:mm:ss')
  const oneDay = 24 * 60 * 60 * 1000
  const oneWeek = 7 * oneDay
  const oneMonth = 31 * oneDay
  const oneYear = 365 * oneDay

  switch (duration) {
    case generateBetweenDate.WEEK:
      startTime = fecha.format(new Date(now - oneWeek), 'YYYY/MM/DD HH:mm:ss')
      return [startTime, endTime]
    case generateBetweenDate.MONTH:
      startTime = fecha.format(new Date(now - oneMonth), 'YYYY/MM/DD HH:mm:ss')
      return [startTime, endTime]
    case generateBetweenDate.YEAR:
      startTime = fecha.format(new Date(now - oneYear), 'YYYY/MM/DD HH:mm:ss')
      return [startTime, endTime]
    default:
      throw new Error(`Unknown duration to generate between date; duration: ${duration}`)
  }
}
generateBetweenDate.WEEK = 'week'
generateBetweenDate.MONTH = 'month'
generateBetweenDate.YEAR = 'year'


export { 
  createSteps, 
  objFrom, 
  dateBetween, 
  not, 
  checkBrowserForPay, 
  timeago,
  generateBetweenDate 
}
