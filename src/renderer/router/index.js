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
      path: '/record',
      component: Layout,
      name: 'record',
      redirect: '/record/list',
      children: [
        {
          path: 'list',
          component: () => import('@/components/records')
        },
        {
          path: 'new',
          component: () => import('@/components/editors/record_editor')
        }
      ]
    },
    {
      path: '/member',
      component: Layout,
      name: 'member',
      redirect: '/member/list',
      children: [{
        path: 'list',
        component: () => import('@/components/members')
      }]
    },
    {
      path: '/book',
      component: Layout,
      name: 'book',
      redirect: '/book/list',
      children: [
        {
          path: 'list',
          component: () => import('@/components/books'),
          children: [
            {
              path: '',
              component: () => import('@/components/books/medicines')
            },
            {
              path: 'formula',
              component: () => import('@/components/books/formulas')
            }
          ]
        }
      ]
    },
    {
      path: '/setting',
      component: Layout,
      name: 'setting',
      redirect: '/member/list',
      children: [{
        path: 'list',
        component: () => import('@/components/setting')
      }]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
