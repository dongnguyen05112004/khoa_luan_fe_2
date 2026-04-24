<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3 custom-font">

    <div class="card shadow-lg border-0 overflow-hidden custom-card" style="max-width: 1050px; width: 100%;">
      <div class="row g-0">

        <!-- ===== LEFT PANEL ===== -->
        <div class="col-md-5 d-none d-md-flex flex-column justify-content-between p-5 text-white custom-bg-gradient">
          <div>
            <div class="d-flex align-items-center gap-3 mb-5">
              <div class="bg-white rounded-circle d-flex align-items-center justify-content-center"
                style="width: 45px; height: 45px; color: #2a4d3e;">
                <i class="bi bi-lightning-charge-fill fs-5"></i>
              </div>
              <span class="fs-4 fw-bold tracking-wide">SGMS-AI</span>
            </div>

            <h1 class="display-5 fw-bold mb-4" style="line-height: 1.2;">
              Hệ thống quản lý<br>phòng Gym thông<br>minh
            </h1>
            <p class="lead mb-5" style="font-size: 1rem; opacity: 0.85;">
              Trải nghiệm sự khác biệt với nền tảng quản lý hội viên và vận hành phòng tập tích hợp trí tuệ nhân tạo hàng đầu.
            </p>

            <div class="d-flex gap-3 flex-wrap">
              <span class="badge rounded-pill fw-normal py-2 px-3 custom-glass-badge">#SmartTraining</span>
              <span class="badge rounded-pill fw-normal py-2 px-3 custom-glass-badge">#AIAnalytics</span>
            </div>
          </div>

          <div class="small mt-5" style="opacity: 0.6; font-size: 0.75rem;">
            © 2024 The Kinetic Atelier. All rights reserved.
          </div>
        </div>

        <!-- ===== RIGHT PANEL ===== -->
        <div class="col-md-7 bg-white d-flex flex-column">

          <!-- Top bar -->
          <div class="d-flex justify-content-end align-items-center gap-3 px-4 pt-3 pb-2 border-bottom">
            <i class="bi bi-question-circle text-muted fs-5" style="cursor:pointer;"></i>
            <i class="bi bi-globe text-muted fs-5" style="cursor:pointer;"></i>
            <div class="rounded-circle overflow-hidden" style="width:36px;height:36px;">
              <img src="https://ui-avatars.com/api/?name=Guest&background=6035d0&color=fff&size=36" alt="avatar" class="w-100 h-100 object-fit-cover">
            </div>
          </div>

          <!-- Form content -->
          <div class="p-4 p-md-5 flex-grow-1 overflow-auto">

            <div class="mb-4">
              <h2 class="fw-bold text-dark mb-1">Đăng Ký Hội Viên</h2>
              <p class="text-muted small">Bắt đầu hành trình tối ưu sức khỏe cùng công nghệ AI.</p>
            </div>

            <!-- Error alert -->
            <div v-if="errorMsg" class="alert alert-danger small py-2 mb-3 border-0" style="background:#fef2f2;color:#dc2626;">
              {{ errorMsg }}
            </div>

            <form @submit.prevent="handleRegister">

              <!-- ── SECTION 1: Thông tin cá nhân ── -->
              <div class="section-title mb-3">
                <i class="bi bi-person-circle me-2 text-purple"></i>
                <span class="fw-bold">Thông tin cá nhân &amp; Tài khoản</span>
              </div>

              <div class="row g-3 mb-3">
                <div class="col-6">
                  <label class="form-label custom-label">Họ tên <span class="text-danger">*</span></label>
                  <div class="custom-input-group">
                    <input v-model="form.hoTen" type="text" class="form-control shadow-none border-0 px-0 fw-medium"
                      placeholder="Nguyễn Văn A" required>
                  </div>
                </div>
                <div class="col-6">
                  <label class="form-label custom-label">Số điện thoại <span class="text-danger">*</span></label>
                  <div class="custom-input-group">
                    <input v-model="form.soDienThoai" type="tel" class="form-control shadow-none border-0 px-0 fw-medium"
                      placeholder="090 123 4567" required>
                  </div>
                </div>
              </div>

              <div class="row g-3 mb-3">
                <div class="col-6">
                  <label class="form-label custom-label">Email <span class="text-danger">*</span></label>
                  <div class="custom-input-group">
                    <input v-model="form.email" type="email" class="form-control shadow-none border-0 px-0 fw-medium"
                      placeholder="example@gmail.com" required>
                  </div>
                </div>
                <div class="col-6">
                  <label class="form-label custom-label">CMND/CCCD <span class="text-danger">*</span></label>
                  <div class="custom-input-group">
                    <input v-model="form.cmnd" type="text" class="form-control shadow-none border-0 px-0 fw-medium"
                      placeholder="012345678912" required>
                  </div>
                </div>
              </div>

              <div class="row g-3 mb-3">
                <div class="col-6">
                  <label class="form-label custom-label">Mật khẩu <span class="text-danger">*</span></label>
                  <div class="custom-input-group d-flex align-items-center">
                    <input v-model="form.matKhau" :type="showPassword ? 'text' : 'password'"
                      class="form-control shadow-none border-0 px-0 fw-medium flex-grow-1"
                      placeholder="••••••••" required>
                    <span class="ms-2 cursor-pointer" @click="showPassword = !showPassword">
                      <i class="bi text-muted" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                    </span>
                  </div>
                  <div class="form-text mt-1 d-flex align-items-center gap-1" style="font-size:0.7rem; color:#94a3b8;">
                    <i class="bi bi-info-circle"></i> Tối thiểu 8 ký tự (chữ &amp; số)
                  </div>
                </div>
                <div class="col-6">
                  <label class="form-label custom-label">Xác nhận mật khẩu <span class="text-danger">*</span></label>
                  <div class="custom-input-group d-flex align-items-center"
                    :class="{ 'input-mismatch': form.xacNhanMatKhau && form.matKhau !== form.xacNhanMatKhau }">
                    <input v-model="form.xacNhanMatKhau" :type="showConfirm ? 'text' : 'password'"
                      class="form-control shadow-none border-0 px-0 fw-medium flex-grow-1"
                      placeholder="••••••••" required>
                    <span class="ms-2 cursor-pointer" @click="showConfirm = !showConfirm">
                      <i class="bi text-muted" :class="showConfirm ? 'bi-eye-slash' : 'bi-eye'"></i>
                    </span>
                  </div>
                  <div v-if="form.xacNhanMatKhau && form.matKhau !== form.xacNhanMatKhau"
                    class="form-text mt-1" style="font-size:0.7rem; color:#dc2626;">
                    <i class="bi bi-exclamation-circle"></i> Mật khẩu không khớp
                  </div>
                </div>
              </div>

              <!-- ── SECTION 2: Gói hội viên ── -->
              <div class="section-title mb-3">
                <i class="bi bi-credit-card-2-front me-2 text-purple"></i>
                <span class="fw-bold">Lựa chọn gói Hội Viên</span>
              </div>

              <div class="row g-3 mb-3">
                <div v-for="plan in plans" :key="plan.id" class="col-6">
                  <div class="plan-card p-3 rounded-3 border position-relative cursor-pointer"
                    :class="{ 'plan-selected': selectedPlan === plan.id }"
                    @click="selectedPlan = plan.id">
                    <span v-if="plan.badge"
                      class="badge badge-recommend position-absolute top-0 start-50 translate-middle px-2 py-1">
                      {{ plan.badge }}
                    </span>
                    <div class="fw-bold text-dark small mb-1" :class="{ 'mt-2': plan.badge }">{{ plan.ten }}</div>
                    <div class="price-value fw-bold mb-1">{{ plan.gia }}</div>
                    <div class="text-muted" style="font-size:0.75rem;">{{ plan.moTa }}</div>
                  </div>
                </div>
              </div>

              <!-- Ngày kích hoạt -->
              <div class="mb-4">
                <label class="form-label custom-label">Ngày bắt đầu kích hoạt</label>
                <div class="custom-input-group d-flex align-items-center">
                  <input v-model="form.ngayKichHoat" type="date"
                    class="form-control shadow-none border-0 px-0 fw-medium flex-grow-1">
                  <i class="bi bi-calendar3 text-muted ms-2"></i>
                </div>
              </div>

              <!-- Submit -->
              <div class="mt-4">
                <button type="submit" class="btn w-100 rounded-pill py-3 fw-bold text-white custom-btn-gradient border-0"
                  :disabled="loading || (form.xacNhanMatKhau && form.matKhau !== form.xacNhanMatKhau)">
                  <span v-if="loading">
                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                    Đang xử lý...
                  </span>
                  <span v-else>Đăng ký &nbsp;<i class="bi bi-arrow-right"></i></span>
                </button>
              </div>

            </form>

            <!-- Success toast -->
            <div v-if="successMsg" class="alert mt-3 border-0 small text-center" style="background:#f0fdf4;color:#16a34a;">
              <i class="bi bi-check-circle me-1"></i> {{ successMsg }}
            </div>

            <div class="text-center mt-3 small">
              <span class="text-muted">Đã có tài khoản?</span>
              <a href="#" class="text-decoration-none fw-bold ms-1 custom-login-link" @click.prevent="goToLogin">Đăng nhập ngay</a>
            </div>

          </div>
        </div>
        <!-- end right panel -->

      </div>
    </div>

  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const showPassword = ref(false)
const showConfirm = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const loading = ref(false)
const selectedPlan = ref('nam')

const plans = [
  { id: 'thang', ten: 'Tháng', gia: '800.000đ', moTa: 'Tập luyện tự do không giới hạn.', badge: null },
  { id: 'quy',   ten: 'Quý',   gia: '2.100.000đ', moTa: 'Tiết kiệm 15% so với gói tháng.', badge: null },
  { id: 'nam',   ten: 'Năm',   gia: '7.200.000đ', moTa: 'Tặng kèm 2 buổi PT & Túi tập Gym.', badge: 'ĐỀ XUẤT CHO BẠN' },
  { id: 'pt',    ten: 'Gói PT',gia: '5.000.000đ', moTa: '10 buổi huấn luyện cá nhân AI-assisted.', badge: null },
]

const form = reactive({
  hoTen: '',
  soDienThoai: '',
  email: '',
  matKhau: '',
  xacNhanMatKhau: '',
})

const handleRegister = async () => {
  errorMsg.value = ''
  successMsg.value = ''

  // Validate phía FE
  if (!form.hoTen || !form.email || !form.matKhau || !form.soDienThoai) {
    errorMsg.value = 'Vui lòng điền đầy đủ thông tin bắt buộc.'
    return
  }
  if (form.matKhau.length < 8) {
    errorMsg.value = 'Mật khẩu phải có ít nhất 8 ký tự.'
    return
  }
  if (form.matKhau !== form.xacNhanMatKhau) {
    errorMsg.value = 'Mật khẩu xác nhận không khớp.'
    return
  }

  loading.value = true
  try {
    // Gọi API đăng ký — BE tự gán role "member"
    const res = await axios.post('http://localhost:8000/api/register', {
      full_name:             form.hoTen,
      phone:                 form.soDienThoai,
      email:                 form.email,
      password:              form.matKhau,
      password_confirmation: form.xacNhanMatKhau,
    })

    // Lưu token ngay sau khi đăng ký thành công
    if (res.data?.token) {
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
    }

    successMsg.value = 'Đăng ký thành công! Đang chuyển hướng...'
    setTimeout(() => router.push('/dangnhap'), 1500)

  } catch (err) {
    // Xử lý lỗi validation Laravel (trả về errors object)
    const errors = err.response?.data?.errors
    if (errors) {
      const first = Object.values(errors)[0]
      errorMsg.value = Array.isArray(first) ? first[0] : first
    } else {
      errorMsg.value = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.'
    }
  } finally {
    loading.value = false
  }
}

const goToLogin = () => router.push('/dangnhap')
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&display=swap');

.custom-font {
  font-family: 'Quicksand', sans-serif;
}

.custom-card {
  border-radius: 2.5rem;
  min-height: 600px;
}

/* ── Left panel ── */
.custom-bg-gradient {
  background: linear-gradient(155deg, #1e3a2f 0%, #3b1fa8 60%, #6b3de0 100%);
}

.custom-glass-badge {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.78rem;
}

/* ── Labels & Inputs ── */
.custom-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.02em;
  margin-bottom: 4px;
}

.custom-input-group {
  border-bottom: 2px solid #e2e8f0;
  transition: border-color 0.25s ease;
  padding-bottom: 4px;
}
.custom-input-group:focus-within {
  border-bottom-color: #6035d0;
}
.input-mismatch {
  border-bottom-color: #dc2626 !important;
}
.custom-input-group .form-control {
  background: transparent;
  font-size: 0.9rem;
}
.custom-input-group .form-control::placeholder {
  color: #cbd5e1;
  font-weight: 500;
}

/* ── Section title ── */
.section-title {
  font-size: 0.95rem;
  color: #1e293b;
  padding-bottom: 6px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 18px;
}
.text-purple { color: #6035d0; }

/* ── Plan cards ── */
.plan-card {
  border-color: #e2e8f0 !important;
  background: #f8f9fa;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  min-height: 90px;
}
.plan-card:hover {
  border-color: #a78bfa !important;
  background: #faf5ff;
}
.plan-selected {
  border-color: #6035d0 !important;
  background: #fff !important;
  box-shadow: 0 0 0 3px rgba(96, 53, 208, 0.12);
}
.price-value {
  font-size: 1rem;
  color: #6035d0;
}
.badge-recommend {
  background: linear-gradient(90deg, #6035d0, #22d3ee);
  color: white;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  border-radius: 20px;
  white-space: nowrap;
}

/* ── Submit Button ── */
.custom-btn-gradient {
  background: linear-gradient(90deg, #6035d0 0%, #22d3ee 100%);
  letter-spacing: 0.03em;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.custom-btn-gradient:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(96, 53, 208, 0.35);
}
.custom-btn-gradient:active {
  transform: translateY(0);
}
.custom-btn-gradient:disabled {
  opacity: 0.75;
}

/* ── Login link ── */
.custom-login-link {
  color: #6035d0;
  transition: opacity 0.2s;
}
.custom-login-link:hover {
  opacity: 0.75;
  text-decoration: underline !important;
}

.cursor-pointer { cursor: pointer; }
.tracking-wide { letter-spacing: 0.05em; }
.object-fit-cover { object-fit: cover; }
</style>
