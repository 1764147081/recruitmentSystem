import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { createRouter, createWebHistory } from "vue-router";
import Empty from "./components/empty.vue";
import { generateRouter } from "./libs/utils";
import "./assets/css/common.css";
import { createPinia } from "pinia";
import store from "./store";
const routes = [{ path: "/", component: Empty }];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (!store.state.hasAuth) {
    await store.dispatch("setUserRouters");
    const newRoutes = generateRouter(store.state.userRouters);
    router.addRoute(newRoutes);
    next({ path: to.path });
  } else {
    next();
  }
});

const pinia = createPinia;
const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(ElementPlus);

app.mount("#app");
