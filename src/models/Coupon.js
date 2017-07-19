export default class Coupon {
  constructor(type, value) {
    this.type = type
    this.value = value
  }

  static AMOUNT = 'amount'
  static DISCOUNT = 'discount'
  static REDUCE = 'reduce'

  getText() {
    const valueText = this.getValueText()
    const typeText = this.getTypeText()

    return `${valueText} ${typeText}`
  }

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
}
