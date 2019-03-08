import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import db from './db'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(iView)

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
