<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3 custom-font position-relative">
    
    <div class="card shadow-lg border-0 overflow-hidden custom-card" style="max-width: 1050px; width: 100%;">
      <div class="row g-0 h-100">
        
        <div class="col-md-6 d-none d-md-flex flex-column justify-content-between p-5 text-white custom-bg-gradient">
          <div>
            <div class="d-flex align-items-center gap-3 mb-5">
              <div class="bg-white rounded-circle d-flex align-items-center justify-content-center" style="width: 45px; height: 45px; color: #2a4d3e;">
                <i class="bi bi-lightning-charge-fill fs-5"></i>
              </div>
              <span class="fs-4 fw-bold tracking-wide">SGMS-AI</span>
            </div>

            <h1 class="display-5 fw-bold mb-4" style="line-height: 1.2;">
              Hệ thống quản lý<br>phòng Gym thông<br>minh
            </h1>
            <p class="lead mb-5" style="font-size: 1.1rem; opacity: 0.85;">
              Trải nghiệm sự khác biệt với nền tảng quản lý hội viên và vận hành phòng tập tích hợp trí tuệ nhân tạo hàng đầu.
            </p>

            <div class="d-flex gap-3">
              <span class="badge rounded-pill fw-normal py-2 px-3 custom-glass-badge">#SmartTraining</span>
              <span class="badge rounded-pill fw-normal py-2 px-3 custom-glass-badge">#AIAnalytics</span>
            </div>
          </div>

          <div class="small mt-5" style="opacity: 0.6; font-size: 0.75rem;">
            © 2026 Nhóm 36. All rights reserved.
          </div>
        </div>

        <div class="col-md-6 p-5 d-flex flex-column justify-content-center bg-white">
          <div class="mb-5">
            <h2 class="fw-bold text-dark mb-2">Đăng Nhập</h2>
            <p class="text-muted small">Chào mừng bạn trở lại với hệ thống quản lý thông minh.</p>
          </div>

          <div v-if="errorMsg" class="alert alert-danger small py-2 mb-4 border-0" style="background-color: #fef2f2; color: #dc2626;">
            {{ errorMsg }}
          </div>

          <form @submit.prevent="handleLogin">
            <div class="mb-4">
              <label class="form-label text-muted fw-bold text-uppercase custom-label">Địa chỉ Email</label>
              <div class="input-group custom-input-group">
                <span class="input-group-text bg-transparent border-0 px-1"><i class="bi bi-envelope text-muted"></i></span>
                <input 
                  v-model="form.email" 
                  type="email" 
                  class="form-control shadow-none border-0 px-2 fw-bold text-dark" 
                  placeholder="email@example.com" 
                  required
                >
              </div>
            </div>

            <div class="mb-4">
              <div class="d-flex justify-content-between align-items-end mb-1">
                <label class="form-label text-muted fw-bold text-uppercase custom-label mb-0">Mật khẩu</label>
              </div>
              
              <div class="input-group custom-input-group mt-2">
                <span class="input-group-text bg-transparent border-0 px-1"><i class="bi bi-lock text-muted"></i></span>
                <input 
                  v-model="form.password" 
                  :type="showPassword ? 'text' : 'password'" 
                  class="form-control shadow-none border-0 px-2 fw-bold text-dark" 
                  placeholder="••••••••" 
                  required
                >
                <span class="input-group-text bg-transparent border-0 px-1 cursor-pointer" @click="showPassword = !showPassword">
                  <i class="bi text-muted hover-dark" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                </span>
              </div>
             <div class="d-flex justify-content-between align-items-center mt-2">
                <div class="form-text text-muted mt-2" style="font-size: 0.65rem;">Tối thiểu 8 ký tự (chữ & số)</div>
                
                  <a href="#" class="text-decoration-none text-muted fw-bold custom-forgot-link">Quên mật khẩu?</a>
             </div>
            </div>

            <div class="mt-5">
              <button type="submit" class="btn w-100 rounded-pill py-3 fw-bold text-white custom-btn-gradient border-0 tracking-wide">
                ĐĂNG NHẬP
              </button>
            </div>
          </form>

          <div class="text-center mt-5 small">
            <span class="text-muted">Chưa có tài khoản?</span>
            <a href="#" class="text-decoration-none fw-bold custom-register-link ms-1">Đăng ký hội viên</a>
          </div>
        </div>

      </div>
    </div>

    <div class="position-absolute bottom-0 mb-4 d-flex gap-4 small text-muted">
       <a href="#" class="text-decoration-none text-muted custom-footer-link">Quy định</a>
       <a href="#" class="text-decoration-none text-muted custom-footer-link">Bảo mật</a>
       <a href="#" class="text-decoration-none text-muted custom-footer-link">Hỗ trợ</a>
    </div>

  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const showPassword = ref(false)
const errorMsg = ref('')

const form = reactive({
  email: '',
  password: ''
})

const handleLogin = () => {
  errorMsg.value = ''
  
  // Logic kiểm tra điều kiện ràng buộc theo US 1
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  
  if (!passwordRegex.test(form.password)) {
    errorMsg.value = 'Mật khẩu không hợp lệ. Vui lòng nhập tối thiểu 8 ký tự bao gồm cả chữ và số.'
    return
  }

  console.log('Call API Login với dữ liệu:', form)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&display=swap');

.custom-font { 
  font-family: 'Quicksand', sans-serif; 
}

.custom-card { 
  border-radius: 2.5rem; 
  min-height: 600px; 
}

.custom-bg-gradient { 
  background: linear-gradient(135deg, #2a4d3e 0%, #6035d0 100%); 
}

.custom-glass-badge {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.custom-label {
  font-size: 0.65rem;
  letter-spacing: 1px;
}

.custom-input-group { 
  border-bottom: 2px solid #e2e8f0; 
  transition: border-color 0.3s ease; 
  padding-bottom: 5px; 
}
.custom-input-group:focus-within { 
  border-bottom-color: #6035d0; 
}
.custom-input-group .form-control {
  background-color: transparent;
}
.custom-input-group .form-control::placeholder {
  color: #cbd5e1;
  font-weight: 500;
}

/* Nút bấm Gradient */
.custom-btn-gradient { 
  background: linear-gradient(90deg, #2a4d3e 0%, #6035d0 100%); 
  transition: transform 0.2s, box-shadow 0.2s; 
}
.custom-btn-gradient:hover { 
  transform: translateY(-2px); 
  box-shadow: 0 10px 20px rgba(96, 53, 208, 0.3); 
}
.custom-btn-gradient:active {
  transform: translateY(0);
}

/* Các link hover */
.custom-forgot-link { font-size: 0.7rem; transition: color 0.2s; }
.custom-forgot-link:hover { color: #6035d0 !important; }

.custom-register-link { color: #2a4d3e; transition: opacity 0.2s; }
.custom-register-link:hover { opacity: 0.8; text-decoration: underline !important; }

.custom-footer-link:hover { color: #333 !important; }
.hover-dark:hover { color: #333 !important; }

.cursor-pointer { cursor: pointer; }
.tracking-wide { letter-spacing: 0.05em; }
</style>