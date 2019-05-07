import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import db from './db'
import iView from 'iview'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import 'iview/dist/styles/iview.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(iView)
dayjs.locale('zh-cn')
Vue.filter('dayjs', function (val, format = 'YYYY-MM-DD') {
  let time = dayjs(val)
  return time.format(format)
})

/* eslint-disable no-new */
db.conn().then((conn) => {
  Object.defineProperty(Vue.prototype, '$db', {
    get () { return conn }
  })

  new Vue({
    components: { App },
    router,
    store,
    template: '<App/>'
  }).$mount('#app')
}).catch((error) => {
  console.log('Error: ', error)
})
