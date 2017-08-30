// 客户浏览器
export const ALI_BROWSER = 'ALI_BROWSER'
export const WEIXIN_BROWSER = 'WEIXIN_BROWSER'
export const UNKNOWN_BROWSER = 'UNKNOWN_BROWSER'

// 业务类型 点餐/代售/群购/多代售/获取商家openid
export const DEAL = 'deal'
export const ESHOP = 'eshop'
export const GROUP_SHOPPING = 'groupshopping'
export const MULTI_ESHOP = 'multieshop'
export const FETCH_OPENID = 'openId'
export const EPAY = 'epay'

// 当前二维码 用户使用状态
export const EMPTY_STATUS = 0
export const SHOPPING_CART_STATUS = 1
export const ORDER_SUCCESS_STATUS = 2

// 一键关注 小v宝公众号链接
export const ATTENTION_HREF = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzUzNTAzNjUzNg==&scene=124#wechat_redirect'

// 不同订单状态
export const UN_PAY_ORDER = 0
export const WAIT_PAY_ORDER = 1
export const PAYED_ORDER = 2