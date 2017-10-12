import axios from 'axios'

const queryOpenid = function(code) {
  const url = `https://deal.xiaovbao.cn/api/test/customer/wechatInfo?code=${code}`;
  return axios.get(url)
};

const displayOpenid = function(params) {
  const url = 'http://api.wechat.huizhanren.cn/api/wxFans/';
  return axios.post(url,params)
};

export {
  queryOpenid,
  displayOpenid
}
