// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
Vue.use(iView)
Vue.config.productionTip = false

/* eslint-disable no-new */
const Office = window.Office

Office.initialize = () => {
  new Vue({
    el: '#app',
    components: {App},
    template: '<App/>'
  })
}