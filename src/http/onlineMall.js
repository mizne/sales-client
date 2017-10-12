import axios from 'axios'

const queryOrder = function(params) {
  const url = 'https://deal.xiaovbao.cn/api/test/epay/order';
  return axios.post(url, params)
};

export {
  queryOrder
}
