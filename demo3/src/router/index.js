import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/login'
import main from '../components/main'
import users from '../components/users'
import roles from '../components/roles'
import welcome from '../components/welcome'
import rights from '../components/rights'
import categories from '../components/categories'
import params from '../components/params'
import goods from '../components/goods'
import add from '../components/add'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path:'/',
      redirect:'/login',
    },
    {
      path:'/login',
      component:login,
    },
    {
      path:'/main',
      component:main,
      redirect:'/welcome',
      children:[
        { path:'/welcome', component:welcome },
        { path:'/users', component:users },
        { path:'/roles', component:roles },
        { path:'/rights', component:rights },
        { path:'/categories',component:categories},
        { path:'/params',component:params},
        { path:'/goods',component:goods},
        { path:'/goods/add',component:add},
      ],
    },
  ],
  mode:'history',
})

router.beforeEach((to,from,next) =>{
  if(to.path=='/login'){
    return next()
  }
  const tk=window.sessionStorage.getItem('token')
  if(!tk){
    return next('/login')
  }
  next()
})

export default router