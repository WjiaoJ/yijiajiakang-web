import Vue from 'vue'
import Router from 'vue-router'
import { AuthToken } from './common/utils'

import Login from './pages/Login'
import HeaderAsideLayout from './components/layouts/HeaderAsideLayout'
import UserManager from './pages/UserManager/UserManager'
import StationsManager from './pages/StationsManager/StationsManager'
import DeviceManager from './pages/DeviceManager/DeviceManager'
import PayManager from './pages/PayManager/PayManager'
import DepositManager from './pages/DepositManager/DepositManager'
import UseManager from './pages/UseManager/UseManager'
import HistoryManager from './pages/HistoryManager/HistoryManager'
import DeviceOverview from './pages/DeviceOverview/DeviceOverview'

import NotFound from './pages/NotFound'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      redirect: '/login',
      component: HeaderAsideLayout,
      children: [
        {
          path: '/user',
          name: 'UserManager',
          component: UserManager
        },
        {
          path: '/stations',
          name: 'StationsManager',
          component: StationsManager
        },
        {
          path: '/device',
          name: 'DeviceManager',
          component: DeviceManager
        },
        {
          path: '/payment',
          name: 'PayManager',
          component: PayManager
        },
        {
          path: '/deposit',
          name: 'DepositManager',
          component: DepositManager
        },
        {
          path: '/use',
          name: 'UseManager',
          component: UseManager
        },
        {
          path: '/history',
          name: 'HistoryManager',
          component: HistoryManager
        },
        {
          path: '/device-overview',
          name: 'DeviceOverview',
          component: DeviceOverview
        }
      ]
    },
    {
      path: '*',
      component: NotFound
    }
  ],
  mode: 'history',
  linkActiveClass: 'active'
})
// router.beforeEach((to, from, next) => {
//   if (AuthToken.get()) {
//     if (to.path === '/login') {
//       next({ path: '/' })
//     } else {
//       next()
//     }
//   } else {
//     if (to.path !== '/login') {
//       next({ path: '/login' })
//     } else {
//       next()
//     }
//   }
// })

export default router
