import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/Login.vue'),
  },
  {
    path: '/',
    name: 'layout',
    component: () => import('@/pages/Layout.vue'),
    children: [
    //   {
    //     path: '/',
    //     name: 'home',
    //     component: () => import('@/pages/Home.vue'),
    //   },
    //   {
    //     path: '/user',
    //     name: 'user',
    //     component: () => import('@/pages/User.vue'),
    //   },
     
      {
        path: '/stationIndex',
        name: 'stationIndex',
        component: () => import('@/pages/StationIndex.vue')
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('@/pages/Profile.vue')
      },
      {
        path: '/department/:id',
        name: 'departmentDetail',
        component: () => import('@/pages/DepartmentDetail.vue'),
        children: [
          {
            path: '/question',
            name: 'question',
            component: () => import('@/components/Question.vue')
          }
        ]
          
      }
    ]

  }
]
const router = createRouter({
  history: createWebHistory(),
  routes,
});




// router.beforeEach(async (to, from, next) => {
//   if (!store.state.hasAuth) {
//     await store.dispatch("setUserRouters");
//     const newRoutes = generateRouter(store.state.userRouters);
//     router.addRoute(newRoutes);
//     next({ path: to.path });
//   } else {
//     next();
//   }
// });
export default router;