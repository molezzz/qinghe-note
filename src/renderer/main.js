import Vue from 'vue'
import axios from 'axios'
// import { remote } from 'electron'
import contextMenu from 'electron-context-menu'

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

console.log(store)

contextMenu({
  labels: {
    copy: '复制',
    cut: '剪切',
    paste: '粘贴',
    saveImage: '保存图片',
    saveImageAs: '图片另存为...',
    copyImageAddress: '复制图片地址',
    copyLink: '复制链接'
  },
  prepend: (defaultActions, params, browserWindow) => [{
    label: '搜本草',
    visible: params.selectionText !== '',
    click: (menuItem, browserWindow, event) => {
      store.dispatch('search', { type: 'medicines', key: params.selectionText })
    }
  },
  {
    label: '搜方剂',
    visible: params.selectionText !== '',
    click: (menuItem, browserWindow, event) => {
      store.dispatch('search', { type: 'formulas', key: params.selectionText })
    }
  }]
})
// let mainWindow = remote.browserWindow
// console.log(mainWindow)
