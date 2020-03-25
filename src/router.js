import Vue from 'vue'
import Router from 'vue-router'
// import Login from './components/Login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Login.vue')

// import Home from './components/Home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Home.vue')

// import Welcome from './components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Welcome.vue')

// import Users from './components/user/Users'
const Users = () => import(/* webpackChunkName: "login_home_welcome" */ './components/user/Users')

// import Rights from './components/power/Rights'
const Rights = () => import(/* webpackChunkName: "login_home_welcome" */ './components/power/Rights')

// import Roles from './components/power/Roles'
const Roles = () => import(/* webpackChunkName: "login_home_welcome" */ './components/power/Roles')

// import Cate from './components/goods/Cate'
const Cate = () => import(/* webpackChunkName: "login_home_welcome" */ './components/goods/Cate')

// import Params from './components/goods/Params'
const Params = () => import(/* webpackChunkName: "login_home_welcome" */ './components/goods/Params')

// import List from './components/goods/List'
const List = () => import(/* webpackChunkName: "login_home_welcome" */ './components/goods/List')

// import Add from './components/goods/Add'
const Add = () => import(/* webpackChunkName: "login_home_welcome" */ './components/goods/Add')

// import Order from './components/order/Order'
const Order = () => import(/* webpackChunkName: "login_home_welcome" */ './components/order/Order')

// import Report from './components/report/Report'
const Report = () => import(/* webpackChunkName: "login_home_welcome" */ './components/report/Report')

Vue.use(Router)
const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [{ path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: List },
        { path: '/goods/add', component: Add },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report }
      ]
    }
  ]
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from 代表哪个路径跳转而来
  // next是一个函数 放行
  // next() 放行 next('/login') 强制跳转
  if (to.path === '/login') return next()
  // 从sessionStorage中获取到保存的token值
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果么有token,强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})
export default router
