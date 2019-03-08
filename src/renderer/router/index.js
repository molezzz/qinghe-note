import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/common'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'landing-page',
    //   component: require('@/components/LandingPage').default
    // },
    {
      path: '/',
      component: Layout,
      name: 'dashboard',
      redirect: '/dashboard',
      children: [{
        path: 'dashboard',
        component: () => import('@/components/dashboard')
      }]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
