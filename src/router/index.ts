import Vue from 'vue'
import VueRouter, { Route } from 'vue-router'
import store from '@/store/index'
import { notification } from 'ant-design-vue'
import { userRoutes } from './routes'
import { AuUtils } from '@/libs/utils'
import { AUTH_HEADER } from '@/constant'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [...userRoutes],
})

const loginRoute = 'login'
const defaultRoute = 'home'
const passRouteList = ['login', 'register']

router.beforeEach((to: Route, from: Route, next: Function) => {
  const loginStatus = store.getters.loginStatus
  if (loginStatus) {
    const permissions = store.getters.permissions
    if (!permissions) {
      store
        .dispatch('getPermissions')
        .then(permissions => {
          store.dispatch('generateRoutes', permissions).then(() => {
            router.addRoutes(store.getters.accessedRoutes)
            const redirect = decodeURIComponent(`${(from.query && from.query.redirect) || to.path}`)
            if (to.path === redirect) {
              next({ ...to, replace: true })
            } else {
              next({ path: redirect, replace: true })
            }
          })
        })
        .catch(() => {
          notification.error({
            message: '错误',
            description: '请求用户信息失败，请重试',
          })
          next({ name: loginRoute, query: { redirect: to.fullPath } })
        })
    } else {
      if (to.name === loginRoute) {
        next({ name: defaultRoute })
      } else {
        next()
      }
    }
  } else {
    if (passRouteList.includes(to.name || '')) {
      next()
    } else {
      next({ name: loginRoute, query: { redirect: to.fullPath } })
    }
  }
})

// reset access-token when refresh page
const accessToken = AuUtils.getSessionStorageItem(AUTH_HEADER)
if (accessToken) {
  store.commit('setAccessToken', accessToken)
}

export default router
