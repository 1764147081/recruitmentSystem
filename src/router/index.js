import { createRouter, createWebHashHistory } from "vue-router";
const routes = [
  {
    path: '/login',
    name: 'login',
    // 从当前目录(../)回到src目录，再进入pages目录
    component: () => import('../pages/Login.vue'),
  },
  {
    path: '/',
    name: 'layout',
    component: () => import('../pages/Layout.vue'),
    redirect: '/empty',
    children: [
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
            path: '/question',
            name: 'question',
            // 从pages目录进入上一级，再进入components目录
            component: () => import('../components/Question.vue')
          }
        ]
          
      }
    ]

  }
]
const router = createRouter({
  history: createWebHashHistory('./XSZX/NXXT/manage/'),
  routes,
});

export default router;
