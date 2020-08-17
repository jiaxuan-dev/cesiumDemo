import Vue from 'vue'
import VueRouter from 'vue-router'
import CesiumContainer from '@/views/CesiumContainer.vue'
import logIn from '@/components/log-in/logIn.vue'

Vue.use(VueRouter)
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [{
  path: '/log-in',
  name: 'logIn',
  // component: () => import('@/components/log-in/logIn')//路由懒加载方式
  component: logIn
}, {
  path: '/',
  name: 'cesiumContainer',
  component: CesiumContainer,
}]
const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

// 清除用户信息
localStorage.removeItem('userinfo')

router.beforeEach((to, from, next) => {
  // 用你的方式获取登录的用户信息
  const userinfo = localStorage.userinfo
  if (userinfo || to.name === 'logIn') {
    // 如果存在用户信息，或者进入的页面是登录页面，则直接进入
    next()
  } else {
    // 不存在用户信息则说明用户未登录，跳转到登录页面，带上当前的页面地址，登录完成后做回跳，
    // 如未登录用户进入用户中心的页面地址，检测到未登录，
    // 自动跳转到登录页面，并且带上用户中心的页面地址，登录完成后重新跳到个人中心页面。
    next({
      name: 'logIn',
      query: {
        redirect: to.path
      }
    })
  }
})

export default router
