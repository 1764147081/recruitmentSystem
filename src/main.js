import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { generateRouter } from "./libs/utils";
import "./assets/css/common.css";
import { createPinia } from "pinia";
import store from "./store";
import router from "@/router";



const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(ElementPlus);

app.mount("#app");
