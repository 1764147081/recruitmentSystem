import { createRouter, createWebHashHistory } from "vue-router";
const routes = [
  {
    path: '/login',
    name: 'login',
    // 从当前目录(../)回到src目录，再进入pages目录
    component: () => import('../pages/Login.vue'),
  },
    {    path: '/',    name: 'layout',    component: () => import('../pages/Layout.vue'),    redirect: '/empty',    children: [
      {
        path: '/empty',
        name: 'empty',
        component: () => import('../pages/Empty.vue')
      },
      {
        path: '/stationIndex',
        name: 'stationIndex',
        component: () => import('../pages/StationIndex.vue')
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('../pages/Profile.vue')
      },
      {
        path: '/department/:stationId',
        name: 'departmentDetail',
        component: () => import('../pages/DepartmentDetail.vue'),
        children: [
          {
        path: 'question',
        name: 'question',
        // 从pages目录进入上一级，再进入components目录
        component: () => import('../components/Question.vue')
      },
      {
        path: 'questionBankDetail',
        name: 'questionBankDetail',
        component: () => import('../pages/QuestionBankDetail.vue')
      }
        ]
      }
    ]
  }
]
const router = createRouter({
  history: createWebHashHistory('/XSZX/NXXT/manage/'),
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  // 不需要登录的页面
  const publicPages = ['/login'];
  // 判断是否需要登录
  const requiresAuth = !publicPages.includes(to.path);
  // 从localStorage或sessionStorage获取token
  const token = localStorage.getItem('token') || sessionStorage.getItem('token') || '--';
  const isLoggedIn = token !== '--';
  
  // 如果需要登录但未登录，则重定向到登录页
  if (requiresAuth && !isLoggedIn) {
    next({ name: 'login' });
  } else {
    // 已登录或不需要登录的页面，继续访问
    next();
  }
});

export default router;
