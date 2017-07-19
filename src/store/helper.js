const generateMutations = function(maps, state) {
  return maps.reduce((accu, curr) => {
    accu[curr.mutationKey] = (state, v) => (state[curr.stateKey] = v)
    return accu
  }, {})
}

const generateGetters = function(keys, state) {
  return keys.reduce((accu, curr) => {
    accu[curr] = () => state[curr]
    return accu
  }, {})
}

export {
  generateMutations,
  generateGetters
}