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

                  <!-- Trạng thái: Đã gửi thành công → nhập token -->
                  <template v-if="sent">
                    <div class="text-center mb-3">
                      <div class="success-icon mx-auto mb-3">
                        <i class="bi bi-envelope-check-fill fs-1 text-success-custom"></i>
                      </div>
                      <h2 class="fw-bold text-dark mb-1">Yêu cầu đã được nhận</h2>
                      <p class="text-muted fs-sm mb-4">
                        Nếu email <strong>{{ email }}</strong> tồn tại trong hệ thống, bạn sẽ nhận được một thư chứa mã xác nhận.<br>
                        Vui lòng kiểm tra hòm thư và dán mã vào ô bên dưới.
                      </p>
                    </div>

                    <!-- Ô dán token -->
                    <div class="token-card p-4 rounded-4 mb-4">
                      <label class="form-label fs-xs fw-bold text-uppercase tracking-wide mb-2" style="color: var(--c-purple);">
                        <i class="bi bi-key-fill me-1"></i> Mã xác nhận (Token)
                      </label>

                      <div class="d-flex gap-2 align-items-center">
                        <input
                          id="paste-token"
                          v-model="pastedToken"
                          type="text"
                          class="form-control token-input fw-bold text-dark shadow-none"
                          placeholder="Dán mã từ email vào đây..."
                          autocomplete="off"
                          spellcheck="false"
                        >
                        <button
                          type="button"
                          class="btn btn-paste rounded-3 flex-shrink-0"
                          title="Dán từ clipboard"
                          @click="pasteFromClipboard"
                        >
                          <i class="bi bi-clipboard-check fs-5"></i>
                        </button>
                      </div>

                      <!-- Auto-fill hint khi có debug token -->
                      <div v-if="debugToken" class="debug-hint mt-3 px-3 py-2 rounded-3 d-flex align-items-center justify-content-between gap-2">
                        <div class="fs-xs" style="color:#f59e0b;">
                          <i class="bi bi-bug-fill me-1"></i>
                          <strong>Debug:</strong> Token đã được điền tự động
                        </div>
                        <button class="btn btn-sm btn-outline-warning rounded-pill py-0 px-2 fs-xs" @click="copyToken">
                          <i class="bi bi-clipboard me-1"></i>Copy
                        </button>
                      </div>

                      <!-- Thông báo lỗi token rỗng -->
                      <div v-if="tokenError" class="mt-2 fs-xs" style="color:#dc2626;">
                        <i class="bi bi-exclamation-circle me-1"></i>{{ tokenError }}
                      </div>
                    </div>

                    <!-- Nút chuyển đến trang đặt lại mật khẩu -->
                    <button
                      id="go-reset-btn"
                      class="btn w-100 py-3 rounded-pill fw-bold custom-gradient-btn border-0 text-white mb-3 shadow-sm"
                      @click="goToReset"
                    >
                      <i class="bi bi-shield-lock me-2"></i> Đặt lại mật khẩu ngay
                    </button>

                    <div class="text-center">
                      <router-link to="/dangnhap" class="text-decoration-none fw-medium fs-sm back-link d-inline-flex align-items-center">
                        <i class="bi bi-arrow-left me-2"></i> Quay lại đăng nhập
                      </router-link>
                    </div>
                  </template>

                  <!-- Trạng thái: Form nhập email -->
                  <template v-else>
                    <h2 class="fw-bold text-dark mb-2">Khôi phục mật khẩu</h2>
                    <p class="text-muted mb-5 fs-sm pe-md-4">
                      Nhập email đã đăng ký. Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu cho bạn.
                    </p>

                    <!-- Alert lỗi -->
                    <div v-if="errorMsg" class="alert-error mb-4 px-3 py-2 rounded-3 fs-sm">
                      <i class="bi bi-exclamation-circle me-2"></i>{{ errorMsg }}
                    </div>

                    <form @submit.prevent="handleForgotPassword">
                      <div class="mb-5">
                        <label class="form-label text-muted fs-xs fw-bold tracking-wide text-uppercase mb-1">Email đã đăng ký</label>
                        <div class="input-group custom-input-group">
                          <span class="input-group-text bg-transparent border-0 px-1">
                            <i class="bi bi-envelope text-muted"></i>
                          </span>
                          <input
                            id="forgot-email"
                            v-model="email"
                            type="email"
                            class="form-control border-0 bg-transparent shadow-none px-2 fw-bold text-dark"
                            placeholder="email@example.com"
                            required
                            :disabled="loading"
                          >
                        </div>
                      </div>

                      <button
                        id="forgot-submit"
                        type="submit"
                        class="btn w-100 py-3 rounded-pill fw-semibold custom-gradient-btn border-0 text-white mb-4 shadow-sm"
                        :disabled="loading"
                      >
                        <span v-if="loading">
                          <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                          Đang gửi yêu cầu...
                        </span>
                        <span v-else>Gửi yêu cầu đặt lại mật khẩu</span>
                      </button>

                      <div class="text-center">
                        <router-link to="/dangnhap" class="text-decoration-none fw-medium fs-sm back-link d-inline-flex align-items-center">
                          <i class="bi bi-arrow-left me-2"></i> Quay lại trang đăng nhập
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
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const email       = ref('')
const loading     = ref(false)
const errorMsg    = ref('')
const sent        = ref(false)
const debugToken  = ref('')
const pastedToken = ref('')
const tokenError  = ref('')

const handleForgotPassword = async () => {
  errorMsg.value = ''

  loading.value = true
  try {
    const res = await axios.post('http://localhost:8000/api/forgot-password', {
      email: email.value,
    })

    sent.value = true

    // Nếu BE ở chế độ APP_DEBUG=true → tự điền token vào ô dán
    if (res.data?.debug_token) {
      debugToken.value  = res.data.debug_token
      pastedToken.value = res.data.debug_token   // auto-fill
    }
  } catch (err) {
    errorMsg.value =
      err.response?.data?.message ||
      'Có lỗi xảy ra. Vui lòng thử lại sau.'
  } finally {
    loading.value = false
  }
}

// Dán từ clipboard vào ô token
const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    pastedToken.value = text.trim()
    tokenError.value  = ''
  } catch {
    tokenError.value = 'Không thể đọc clipboard. Hãy dán thủ công vào ô trên.'
  }
}

// Sao chép debug token ra clipboard
const copyToken = async () => {
  try {
    await navigator.clipboard.writeText(debugToken.value)
  } catch { /* ignore */ }
}

// Chuyển đến /reset-password?token=...&email=...
const goToReset = () => {
  tokenError.value = ''
  if (!pastedToken.value.trim()) {
    tokenError.value = 'Vui lòng dán mã xác nhận từ email vào ô trên.'
    return
  }
  router.push({
    path: '/reset-password',
    query: {
      token: pastedToken.value.trim(),
      email: email.value,
    },
  })
}

// Xóa lỗi khi người dùng bắt đầu nhập
watch(pastedToken, () => { tokenError.value = '' })
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

.custom-input-group {
  border-bottom: 2px solid #e2e8f0;
  transition: border-color 0.3s;
  padding-bottom: 5px;
}
.custom-input-group:focus-within { border-bottom-color: var(--c-purple); }
.custom-input-group .form-control::placeholder { color: #cbd5e1; font-weight: 500; }
.custom-input-group .form-control { background-color: transparent; }

.alert-error {
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.debug-box {
  background: #1e1e2e;
  border: 1px solid #3d3d5c;
}
.text-warning-custom { color: #f59e0b; }

/* ── Token card ── */
.token-card {
  background: linear-gradient(135deg, #f0f4ff 0%, #f5f0ff 100%);
  border: 1.5px solid #ddd6fe;
}

.token-input {
  border: 1.5px solid #ddd6fe !important;
  border-radius: 0.5rem !important;
  background: #fff !important;
  font-size: 0.82rem;
  letter-spacing: 0.03em;
  padding: 0.65rem 0.85rem;
  transition: border-color 0.25s;
}
.token-input:focus {
  border-color: var(--c-purple) !important;
  box-shadow: 0 0 0 3px rgba(96, 53, 208, 0.1) !important;
}
.token-input::placeholder { color: #b4b8d0; font-weight: 500; }

.btn-paste {
  background: var(--c-purple);
  color: #fff;
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-paste:hover {
  background: #4a26a8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(96,53,208,0.3);
}
.btn-paste:active { transform: translateY(0); }

.debug-hint {
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.25);
}

.success-icon { color: var(--c-green); }
.text-success-custom { color: var(--c-green); }

.back-link { color: var(--c-green); transition: opacity 0.2s; }
.back-link:hover { opacity: 0.75; }

.logo-icon  { width: 36px; height: 36px; }
.support-icon { width: 44px; height: 44px; }

.tracking-wide { letter-spacing: 0.05em; }
.fs-sm { font-size: 0.875rem; }
.fs-xs { font-size: 0.72rem; }
.opacity-60 { opacity: 0.6; }
.hover-dark:hover { color: #1e293b !important; }

@media (max-width: 991.98px) {
  .auth-card { min-height: auto; }
}
</style>