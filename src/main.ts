import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createRouter,createWebHistory } from 'vue-router'
import Empty from './components/empty.vue'


const routes = [
    {path: '/', component: Empty}


]
const router = createRouter({
    history: createWebHistory(),
    routes,
})

const app = createApp(App)
app.use(router)
app.use(ElementPlus)

app.mount('#app')
