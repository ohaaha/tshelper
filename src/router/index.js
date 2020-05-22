import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Calltheroll from '@/views/Calltheroll'
import Leave from '@/views/Leave'
import Project from '@/views/Project'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/calltheroll',
      name: 'calltheroll',
      component: Calltheroll
    },
    {
      path: '/leave',
      name: 'leave',
      component: Leave
    },
    {
      path: '/project',
      name: 'project',
      component: Project
    }
  ]
})
