<template>
  <div class="auth-wrapper d-flex align-items-center justify-content-center bg-light min-vh-100 p-3">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-xl-10">
          <div class="card border-0 shadow-lg auth-card overflow-hidden">
            <div class="row g-0 h-100">
              
              <div class="col-lg-6 d-none d-lg-flex flex-column justify-content-between text-white p-5 auth-sidebar custom-gradient">
                <div>
                  <div class="d-flex align-items-center mb-4">
                    <div class="logo-icon bg-white text-dark rounded-circle d-flex align-items-center justify-content-center me-2">
                      <i class="bi bi-lightning-fill"></i>
                    </div>
                    <span class="fw-bold fs-5 tracking-wide">SGMS-AI</span>
                  </div>
                  
                  <h1 class="display-5 fw-bold mb-4 lh-sm">Hệ thống quản lý <br> phòng Gym thông <br> minh</h1>
                  <p class="fs-6 opacity-75 mb-5 lh-base pe-4">
                    Trải nghiệm sự khác biệt với nền tảng quản lý hội viên và vận hành phòng tập tích hợp trí tuệ nhân tạo hàng đầu.
                  </p>
                  
                  <div class="d-flex gap-2">
                    <span class="badge custom-badge rounded-pill px-3 py-2">#SmartTraining</span>
                    <span class="badge custom-badge rounded-pill px-3 py-2">#AiAnalytics</span>
                  </div>
                </div>
                
                <div class="small opacity-75 mt-5">
                  © 2024 The Kinetic Atelier. All rights reserved.
                </div>
              </div>

              <div class="col-lg-6 d-flex flex-column p-4 p-md-5 bg-white position-relative">
                <div class="flex-grow-1 d-flex flex-column justify-content-center px-lg-4">
                  <h2 class="fw-bold text-dark mb-2">Đặt lại mật khẩu</h2>
                  <p class="text-muted mb-4 fs-sm pe-md-4">
                    Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
                  </p>

                  <form @submit.prevent="handleUpdatePassword">
                    
                    <div class="mb-3">
                      <label class="form-label text-muted fs-xs fw-bold tracking-wide mb-1">Mật khẩu mới</label>
                      <div class="input-group custom-pill-input">
                        <span class="input-group-text bg-light border-0 text-muted ps-4 rounded-start-pill">
                          <i class="bi bi-lock"></i>
                        </span>
                        <input :type="showPassword ? 'text' : 'password'" class="form-control border-0 bg-light shadow-none py-2 px-2" placeholder="••••••••" required v-model="password">
                        <span class="input-group-text bg-light border-0 text-muted pe-4 rounded-end-pill cursor-pointer" @click="togglePassword">
                          <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                        </span>
                      </div>
                    </div>

                    <div class="mb-2">
                      <label class="form-label text-muted fs-xs fw-bold tracking-wide mb-1">Xác nhận mật khẩu mới</label>
                      <div class="input-group custom-pill-input">
                        <span class="input-group-text bg-light border-0 text-muted ps-4 rounded-start-pill">
                          <i class="bi bi-shield-lock"></i>
                        </span>
                        <input :type="showConfirmPassword ? 'text' : 'password'" class="form-control border-0 bg-light shadow-none py-2 px-2" placeholder="••••••••" required v-model="confirmPassword">
                        <span class="input-group-text bg-light border-0 text-muted pe-4 rounded-end-pill cursor-pointer" @click="toggleConfirmPassword">
                          <i class="bi" :class="showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                        </span>
                      </div>
                    </div>

                    <div class="text-muted fs-xs mb-4 ms-2">
                      <i class="bi bi-info-circle me-1"></i> Tối thiểu 8 ký tự (chữ & số)
                    </div>

                    <button type="submit" class="btn btn-primary w-100 py-3 rounded-pill fw-semibold btn-purple-blue border-0 mb-4 shadow-sm d-flex justify-content-center align-items-center">
                      Cập nhật mật khẩu <i class="bi bi-arrow-right ms-2"></i>
                    </button>
                    
                    <div class="text-center">
                      <router-link to="/dangnhap" class="text-muted text-decoration-none fw-medium fs-sm hover-dark d-inline-flex align-items-center">
                        <i class="bi bi-arrow-left me-2"></i> Quay lại đăng nhập
                      </router-link>
                    </div>

                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Trạng thái lưu trữ dữ liệu nhập vào
const password = ref('');
const confirmPassword = ref('');

// Trạng thái Ẩn/Hiện mật khẩu
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Hàm Đảo ngược trạng thái Ẩn/Hiện
const togglePassword = () => { showPassword.value = !showPassword.value; };
const toggleConfirmPassword = () => { showConfirmPassword.value = !showConfirmPassword.value; };

// Hàm xử lý gửi form
const handleUpdatePassword = () => {
  // Kiểm tra độ dài
  if (password.value.length < 8) {
    alert("Mật khẩu phải chứa ít nhất 8 ký tự!");
    return;
  }
  // Kiểm tra khớp mật khẩu
  if (password.value !== confirmPassword.value) {
    alert("Mật khẩu xác nhận không khớp!");
    return;
  }

  alert("Cập nhật mật khẩu thành công!");
  router.push('/dangnhap'); // Chuyển hướng về trang đăng nhập
};
</script>

<style scoped>
.auth-wrapper {
  --color-green: #2B5A46;
  --color-purple: #7831DA;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.auth-card { border-radius: 24px; min-height: 600px; }

/* Background bên trái */
.custom-gradient {
  background: linear-gradient(135deg, var(--color-green) 0%, var(--color-purple) 100%);
}

.btn-purple-blue {
  background: linear-gradient(135deg, #7831DA 0%, #3db5ff 100%);
  color: white;
  transition: opacity 0.3s ease, transform 0.2s ease;
}
.btn-purple-blue:hover {
  opacity: 0.95;
  transform: translateY(-2px);
}

/* Tùy chỉnh ô input bo tròn hoàn toàn */
.custom-pill-input .input-group-text {
  background-color: #f3f4f6 !important;
}
.custom-pill-input .form-control {
  background-color: #f3f4f6 !important;
}
.custom-pill-input .form-control:focus {
  box-shadow: none;
}
.cursor-pointer {
  cursor: pointer;
}

.custom-badge {
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-weight: 500;
}

.hover-dark:hover { color: #212529 !important; }
.logo-icon { width: 32px; height: 32px; }
.tracking-wide { letter-spacing: 0.05em; }
.fs-xs { font-size: 0.75rem; }
.fs-sm { font-size: 0.875rem; }
</style>