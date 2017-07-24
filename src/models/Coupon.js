export default class Coupon {
  /**
   * Creates an instance of Coupon.
   * @param {any} type 优惠券类型
   * @param {any} value 优惠券数值
   * @memberof Coupon
   */
  constructor(type, value) {
    this.type = type
    this.value = value
  }

  static AMOUNT = 'amount'
  static DISCOUNT = 'discount'
  static REDUCE = 'reduce'

  /**
   * 获取不同类型的优惠券 描述文本
   * 
   * @returns 描述文本
   * @memberof Coupon
   */
  getText() {
    const valueText = this.getValueText()
    const typeText = this.getTypeText()

    return `${valueText} ${typeText}`
  }

  /**
   * 获取不同类型的优惠券 类型描述文本
   * 
   * @returns 类型描述文本
   * @memberof Coupon
   */
  getTypeText() {
    switch(this.type) {
      case Coupon.AMOUNT: return `优惠券`
      case Coupon.DISCOUNT: return `打折券`
      case Coupon.REDUCE: 
        const [total] = this.value.split('-')
        return `满 ${total} 可用`
      default: 
        console.error(`Unknown coupon type: ${this.type}`)
    }
  }

  /**
   * 获取不同类型的优惠券 数值描述文本
   * 
   * @returns 数值描述文本
   * @memberof Coupon
   */
  getValueText() {
    switch(this.type) {
      case Coupon.AMOUNT: return `${this.value} 元`
      case Coupon.DISCOUNT: return `${this.value * 10} 折`
      case Coupon.REDUCE: 
        const [, free] = this.value.split('-')
        return `${free} 元`
      default: 
        console.error(`Unknown coupon type: ${this.type}`)
    }
  }

  
  /**
   * 
   * 
   * @param {any} srcPrice 原始价格
   * @returns 计算优惠券后的 价格
   * @memberof Coupon
   */
  computePrice(srcPrice) {
    switch(this.type) {
      case Coupon.AMOUNT: return srcPrice - this.value
      case Coupon.DISCOUNT: return parseFloat((this.value * srcPrice).toFixed(2))
      case Coupon.REDUCE: 
        const [, free] = this.value.split('-')
        return srcPrice - free
      default: 
        console.error(`Unknown coupon type: ${this.type}`)
    }
  }
}
