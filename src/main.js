import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Default from './layout/wrapper/quanly.vue'
import axios from 'axios'

// ============================================================
// Cấu hình axios toàn cục
// Proxy Vite sẽ forward /api/* → http://localhost:8000
// ============================================================
axios.defaults.baseURL = ''           // để trống, dùng proxy của Vite
axios.defaults.withCredentials = false // dùng Bearer token, không cần cookie

// Thay vì cấu hình token tĩnh 1 lần lúc tải trang, 
// ta dùng Interceptor để luôn tự động lấy token mới nhất từ localStorage cho mọi request API
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

const app = createApp(App)

app.use(router)
app.component("default-layout", Default)
app.mount("#app")