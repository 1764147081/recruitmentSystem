import axios from 'axios'
import { useUserStore } from '../store/user'

// 创建axios实例
const service = axios.create({
  baseURL: 'https://i.sdu.edu.cn/XSZX/NXXT/api',
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 获取用户store实例
    const userStore = useUserStore()
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    // 如果store中有token，则添加到请求头中
    if (userStore.getToken && userStore.getToken !== '--') {
      config.headers['Authorization'] = `Bearer ${userStore.getToken}`
    }
    
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

export default service