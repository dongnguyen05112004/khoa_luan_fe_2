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
                  <h2 class="fw-bold text-dark mb-2">Khôi phục mật khẩu</h2>
                  <p class="text-muted mb-5 fs-sm pe-md-4">
                    Vui lòng nhập email của bạn để nhận mã khôi phục hoặc đường đặt lại mật khẩu.
                  </p>

                  <form @submit.prevent="handleResetPassword">
                    <div class="mb-4">
                      <label class="form-label text-muted fs-xs fw-bold tracking-wide text-uppercase mb-1">Email đã đăng ký</label>
                      <div class="input-group custom-input-group">
                        <span class="input-group-text bg-transparent border-0 border-bottom text-muted ps-0">
                          <i class="bi bi-envelope"></i>
                        </span>
                        <input type="email" class="form-control border-0 border-bottom bg-transparent shadow-none px-2" placeholder="name@company.com" required v-model="email">
                      </div>
                    </div>

                    <button type="submit" class="btn btn-primary w-100 py-3 rounded-pill fw-semibold custom-gradient-btn border-0 mb-4 shadow-sm">
                      Nhận mã / Link đặt lại mật khẩu
                    </button>
                    
                    <div class="text-center">
                      <router-link to="/dangnhap" class="text-success text-decoration-none fw-medium fs-sm d-inline-flex align-items-center">
                        <i class="bi bi-arrow-left me-2"></i> Quay lại trang đăng nhập
                      </router-link>
                    </div>
                  </form>
                </div>
                
                <div class="d-flex align-items-center mt-5 px-lg-4">
                  <div class="support-icon bg-light rounded-circle d-flex align-items-center justify-content-center me-3 text-muted">
                    <i class="bi bi-headset fs-5"></i>
                  </div>
                  <div>
                    <div class="fs-xs text-muted text-uppercase fw-bold">Cần hỗ trợ?</div>
                    <div class="fw-bold text-dark fs-sm">Liên hệ hotline 1900 8888</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
          <div class="d-flex justify-content-center justify-content-md-between align-items-center mt-4 text-muted fs-xs px-3 flex-wrap gap-2">
            <div>© 2024 The Kinetic Atelier. All rights reserved.</div>
            <div class="d-flex gap-3 fw-medium">
              <a href="#" class="text-muted text-decoration-none hover-dark">Quy định</a>
              <a href="#" class="text-muted text-decoration-none hover-dark">Bảo mật</a>
              <a href="#" class="text-muted text-decoration-none hover-dark">Hỗ trợ</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Biến lưu trữ giá trị email người dùng nhập
const email = ref('');

// Hàm xử lý khi người dùng bấm nút
const handleResetPassword = () => {
  alert(`Đã gửi yêu cầu khôi phục mật khẩu đến: ${email.value}`);
};
</script>

<style scoped>
/* Biến màu sắc toàn cục */
.auth-wrapper {
  --color-green: #2B5A46;
  --color-purple: #7831DA;
  background-color: #f8f9fa;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* Card Container */
.auth-card {
  border-radius: 24px;
  min-height: 600px;
}

/* Custom Gradient Xanh -> Tím */
.custom-gradient {
  background: linear-gradient(135deg, var(--color-green) 0%, var(--color-purple) 100%);
}
.custom-gradient-btn {
  background: linear-gradient(135deg, #376a54 0%, #8b45e8 100%);
  transition: opacity 0.3s ease, transform 0.2s ease;
}
.custom-gradient-btn:hover {
  opacity: 0.95;
  transform: translateY(-2px); /* Hiệu ứng nẩy nhẹ khi trỏ chuột */
}

/* Typography & Utilities */
.tracking-wide { letter-spacing: 0.05em; }
.fs-sm { font-size: 0.875rem; }
.fs-xs { font-size: 0.75rem; }
.text-success { color: #3b7a49 !important; }

/* Custom Badge (Thẻ hashtag mờ) */
.custom-badge {
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-weight: 500;
}

.custom-input-group .input-group-text,
.custom-input-group .form-control {
  border-bottom: 2px solid #e9ecef !important;
  border-radius: 0; /* Xóa bo góc mặc định của input */
}
.custom-input-group .form-control:focus {
  border-bottom-color: var(--color-purple) !important;
}

/* Icons */
.logo-icon { width: 32px; height: 32px; }
.support-icon { width: 44px; height: 44px; }

/* Hover effects */
.hover-dark:hover { color: #212529 !important; }

/* Responsive (Tự động thu lại khi dùng điện thoại) */
@media (max-width: 991.98px) {
  .auth-card {
    min-height: auto;
  }
}
</style>