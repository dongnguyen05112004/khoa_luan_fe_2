<template>
  <div class="auth-wrapper d-flex align-items-center justify-content-center min-vh-100 p-3">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-xl-10">
          <div class="card border-0 shadow-lg auth-card overflow-hidden">
            <div class="row g-0 h-100">

              <!-- ── Sidebar trái ── -->
              <div class="col-lg-6 d-none d-lg-flex flex-column justify-content-between text-white p-5 custom-gradient">
                <div>
                  <div class="d-flex align-items-center mb-4">
                    <div class="logo-icon bg-white text-dark rounded-circle d-flex align-items-center justify-content-center me-2">
                      <i class="bi bi-lightning-charge-fill"></i>
                    </div>
                    <span class="fw-bold fs-5 tracking-wide">SGMS-AI</span>
                  </div>

                  <h1 class="display-5 fw-bold mb-4 lh-sm">Hệ thống quản lý<br>phòng Gym thông<br>minh</h1>
                  <p class="fs-6 opacity-75 mb-5 lh-base pe-4">
                    Trải nghiệm sự khác biệt với nền tảng quản lý hội viên và vận hành phòng tập tích hợp trí tuệ nhân tạo hàng đầu.
                  </p>

                  <div class="d-flex gap-2">
                    <span class="badge custom-badge rounded-pill px-3 py-2">#SmartTraining</span>
                    <span class="badge custom-badge rounded-pill px-3 py-2">#AIAnalytics</span>
                  </div>
                </div>

                <div class="small opacity-60 mt-5">© 2026 Nhóm 36. All rights reserved.</div>
              </div>

              <!-- ── Form phải ── -->
              <div class="col-lg-6 d-flex flex-column p-4 p-md-5 bg-white">
                <div class="flex-grow-1 d-flex flex-column justify-content-center px-lg-3">

                  <!-- Trạng thái: Đặt lại thành công -->
                  <template v-if="success">
                    <div class="text-center">
                      <div class="success-icon mx-auto mb-4">
                        <i class="bi bi-shield-check-fill fs-1"></i>
                      </div>
                      <h2 class="fw-bold text-dark mb-2">Mật khẩu đã được cập nhật!</h2>
                      <p class="text-muted fs-sm mb-5">
                        Mật khẩu của bạn đã được đặt lại thành công. Vui lòng đăng nhập lại bằng mật khẩu mới.
                      </p>
                      <router-link
                        to="/dangnhap"
                        class="btn w-100 py-3 rounded-pill fw-semibold custom-gradient-btn border-0 text-white"
                      >
                        <i class="bi bi-box-arrow-in-right me-2"></i> Đăng nhập ngay
                      </router-link>
                    </div>
                  </template>

                  <!-- Trạng thái: Token không hợp lệ / hết hạn (bắt từ URL) -->
                  <template v-else-if="invalidLink">
                    <div class="text-center">
                      <div class="error-icon mx-auto mb-4">
                        <i class="bi bi-exclamation-triangle-fill fs-1"></i>
                      </div>
                      <h2 class="fw-bold text-dark mb-2">Đường dẫn không hợp lệ</h2>
                      <p class="text-muted fs-sm mb-5">
                        Đường dẫn đặt lại mật khẩu thiếu thông tin cần thiết hoặc đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu mới.
                      </p>
                      <router-link
                        to="/forgot-password"
                        class="btn w-100 py-3 rounded-pill fw-semibold custom-gradient-btn border-0 text-white"
                      >
                        <i class="bi bi-arrow-clockwise me-2"></i> Yêu cầu đặt lại mật khẩu
                      </router-link>
                    </div>
                  </template>

                  <!-- Trạng thái: Form đặt lại mật khẩu -->
                  <template v-else>
                    <h2 class="fw-bold text-dark mb-2">Đặt lại mật khẩu</h2>
                    <p class="text-muted mb-4 fs-sm pe-md-4">
                      Nhập mật khẩu mới cho tài khoản <strong>{{ emailFromUrl }}</strong>
                    </p>

                    <!-- Alert lỗi -->
                    <div v-if="errorMsg" class="alert-error mb-4 px-3 py-2 rounded-3 fs-sm">
                      <i class="bi bi-exclamation-circle me-2"></i>{{ errorMsg }}
                    </div>

                    <form @submit.prevent="handleResetPassword">
                      <!-- Mật khẩu mới -->
                      <div class="mb-4">
                        <label class="form-label text-muted fs-xs fw-bold tracking-wide text-uppercase mb-1">Mật khẩu mới</label>
                        <div class="input-group custom-pill-input">
                          <span class="input-group-text bg-light border-0 text-muted ps-4 rounded-start-pill">
                            <i class="bi bi-lock"></i>
                          </span>
                          <input
                            id="new-password"
                            v-model="password"
                            :type="showPassword ? 'text' : 'password'"
                            class="form-control border-0 bg-light shadow-none py-2 px-2"
                            placeholder="••••••••"
                            required
                            :disabled="loading"
                          >
                          <span
                            class="input-group-text bg-light border-0 text-muted pe-4 rounded-end-pill cursor-pointer"
                            @click="showPassword = !showPassword"
                          >
                            <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                          </span>
                        </div>
                      </div>

                      <!-- Xác nhận mật khẩu -->
                      <div class="mb-2">
                        <label class="form-label text-muted fs-xs fw-bold tracking-wide text-uppercase mb-1">Xác nhận mật khẩu mới</label>
                        <div class="input-group custom-pill-input">
                          <span class="input-group-text bg-light border-0 text-muted ps-4 rounded-start-pill">
                            <i class="bi bi-shield-lock"></i>
                          </span>
                          <input
                            id="confirm-password"
                            v-model="confirmPassword"
                            :type="showConfirm ? 'text' : 'password'"
                            class="form-control border-0 bg-light shadow-none py-2 px-2"
                            placeholder="••••••••"
                            required
                            :disabled="loading"
                          >
                          <span
                            class="input-group-text bg-light border-0 text-muted pe-4 rounded-end-pill cursor-pointer"
                            @click="showConfirm = !showConfirm"
                          >
                            <i class="bi" :class="showConfirm ? 'bi-eye-slash' : 'bi-eye'"></i>
                          </span>
                        </div>
                      </div>

                      <div class="text-muted fs-xs mb-5 mt-2 ms-1">
                        <i class="bi bi-info-circle me-1"></i> Tối thiểu 8 ký tự (chữ &amp; số)
                      </div>

                      <button
                        id="reset-submit"
                        type="submit"
                        class="btn w-100 py-3 rounded-pill fw-semibold custom-gradient-btn border-0 text-white mb-4 shadow-sm d-flex justify-content-center align-items-center"
                        :disabled="loading"
                      >
                        <span v-if="loading">
                          <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                          Đang cập nhật...
                        </span>
                        <span v-else>Cập nhật mật khẩu <i class="bi bi-arrow-right ms-2"></i></span>
                      </button>

                      <div class="text-center">
                        <router-link to="/dangnhap" class="text-muted text-decoration-none fw-medium fs-sm hover-dark d-inline-flex align-items-center">
                          <i class="bi bi-arrow-left me-2"></i> Quay lại đăng nhập
                        </router-link>
                      </div>
                    </form>
                  </template>

                </div>
              </div>

            </div>
          </div>

          <div class="d-flex justify-content-center justify-content-md-between align-items-center mt-4 text-muted fs-xs px-3 flex-wrap gap-2">
            <div>© 2026 Nhóm 36. All rights reserved.</div>
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route  = useRoute()
const router = useRouter()

const password        = ref('')
const confirmPassword = ref('')
const showPassword    = ref(false)
const showConfirm     = ref(false)
const loading         = ref(false)
const errorMsg        = ref('')
const success         = ref(false)
const invalidLink     = ref(false)

// Lấy token + email từ query string (?token=...&email=...)
const tokenFromUrl  = ref('')
const emailFromUrl  = ref('')

onMounted(() => {
  tokenFromUrl.value = route.query.token  ?? ''
  emailFromUrl.value = route.query.email  ?? ''

  if (!tokenFromUrl.value || !emailFromUrl.value) {
    invalidLink.value = true
  }
})

const handleResetPassword = async () => {
  errorMsg.value = ''

  if (password.value.length < 8) {
    errorMsg.value = 'Mật khẩu phải chứa ít nhất 8 ký tự.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Mật khẩu xác nhận không khớp.'
    return
  }

  loading.value = true
  try {
    await axios.post('http://localhost:8000/api/reset-password', {
      email:                 emailFromUrl.value,
      token:                 tokenFromUrl.value,
      password:              password.value,
      password_confirmation: confirmPassword.value,
    })

    success.value = true
  } catch (err) {
    errorMsg.value =
      err.response?.data?.message ||
      'Có lỗi xảy ra. Vui lòng thử lại hoặc yêu cầu link mới.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&display=swap');

.auth-wrapper {
  --c-green: #2a4d3e;
  --c-purple: #6035d0;
  background-color: #f4f6fb;
  font-family: 'Quicksand', sans-serif;
}

.auth-card { border-radius: 2rem; min-height: 580px; }

.custom-gradient {
  background: linear-gradient(135deg, var(--c-green) 0%, var(--c-purple) 100%);
}

.custom-gradient-btn {
  background: linear-gradient(90deg, var(--c-green) 0%, var(--c-purple) 100%);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.custom-gradient-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(96, 53, 208, 0.3);
}
.custom-gradient-btn:active { transform: translateY(0); }

.custom-badge {
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255,255,255,0.2);
  font-weight: 500;
}

/* Input bo tròn */
.custom-pill-input .input-group-text,
.custom-pill-input .form-control {
  background-color: #f3f4f6 !important;
}
.custom-pill-input .form-control:focus { box-shadow: none; }

.alert-error {
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

/* Trạng thái thành công / lỗi */
.success-icon { color: var(--c-green); }
.error-icon   { color: #e74c3c; }

.cursor-pointer { cursor: pointer; }
.logo-icon  { width: 36px; height: 36px; }
.tracking-wide { letter-spacing: 0.05em; }
.fs-sm { font-size: 0.875rem; }
.fs-xs { font-size: 0.72rem; }
.opacity-60 { opacity: 0.6; }
.hover-dark:hover { color: #1e293b !important; }

@media (max-width: 991.98px) {
  .auth-card { min-height: auto; }
}
</style>