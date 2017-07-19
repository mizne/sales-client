import * as store from 'store'
store.has = function (key) {
  return !!store.get(key)
}
export default store
