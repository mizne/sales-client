import storage from '@/util/storage'

export default class Delivery {
  constructor(feeId, feeValue, duration, startPrice) {
    this.feeId = feeId
    this.feeValue = feeValue
    this.duration = duration
    this.startPrice = startPrice
  }
}