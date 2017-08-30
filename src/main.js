// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import 'normalize.css'
import 'animate.css'
import 'babel-polyfill'
import VueVisitor from 'vue-visitor'

import './assets/iconfont/iconfont.css'
import App from './App'
import router from '@/router/index'
import store from '@/store/index'
import '@/util/error-handler.js'

import LogRocket from 'logrocket'
import VueAnalytics from 'vue-analytics'
import numkeyboard from 'vue-numkeyboard'
import 'vue-numkeyboard/style.css'

Vue.use(numkeyboard)

LogRocket.init('49bwep/sales-zm4qk')
FastClick.attach(document.body)

Vue.use(VueVisitor)
Vue.use(VueAnalytics, {
  id: 'UA-104521154-1',
  router
})
Vue.config.productionTip = false
// Vue.config.devtools = true

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
