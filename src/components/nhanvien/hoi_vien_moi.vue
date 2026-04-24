<template>
  <div class="reg-page">

    <!-- ===== PAGE TITLE ROW ===== -->
    <div class="reg-title-row">
      <div>
        <h1 class="reg-title">Đăng ký hội viên mới</h1>
        <p class="reg-sub">Thiết lập hồ sơ hiệu suất cho khách hàng mới của Performance Curator.</p>
      </div>
      <button class="btn-ai-badge">
        <span class="ai-star">✦</span>
        AI-Powered Registration active
      </button>
    </div>

    <!-- ===== MAIN LAYOUT ===== -->
    <div class="reg-body">

      <!-- ========== LEFT: Thông tin cá nhân ========== -->
      <div class="reg-left">
        <div class="section-card">

          <div class="section-title">
            <i class="fas fa-user-circle section-ico"></i>
            Thông tin cá nhân
          </div>

          <!-- Row 1: Họ tên + SĐT -->
          <div class="form-row two-col">
            <div class="form-group">
              <label class="form-label">HỌ VÀ TÊN <span class="req">*</span></label>
              <input v-model="form.name" type="text" class="form-input" placeholder="Nguyễn Văn A" />
            </div>
            <div class="form-group">
              <label class="form-label">SỐ ĐIỆN THOẠI <span class="req">*</span></label>
              <input v-model="form.phone" type="tel" class="form-input" placeholder="090 123 4567" />
            </div>
          </div>

          <!-- Row 2: Email (full width) -->
          <div class="form-row">
            <div class="form-group full">
              <label class="form-label">ĐỊA CHỈ EMAIL <span class="req">*</span></label>
              <input v-model="form.email" type="email" class="form-input" placeholder="example@curator.com" />
            </div>
          </div>

          <!-- Row 3: Mục tiêu + Tiền sử -->
          <div class="form-row two-col">
            <div class="form-group">
              <label class="form-label">MỤC TIÊU TẬP LUYỆN</label>
              <textarea
                v-model="form.goal"
                class="form-textarea"
                placeholder="Ví dụ: Giảm 5kg mỡ, Tăng cơ bắp..."
              ></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">TIỀN SỬ Y TẾ</label>
              <textarea
                v-model="form.medical"
                class="form-textarea"
                placeholder="Ví dụ: Chấn thương đầu gối, Hen suyễn..."
              ></textarea>
            </div>
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <button class="btn-cancel" @click="cancel">Hủy bỏ</button>
            <button class="btn-submit" @click="submit">
              <i class="fas fa-qrcode"></i>
              Lưu hồ sơ &amp; Cấp mã QR
            </button>
          </div>

        </div>
      </div>

      <!-- ========== RIGHT ========== -->
      <div class="reg-right">

        <!-- Card 1: Thông số sức khỏe (dark green) -->
        <div class="health-card">
          <div class="health-header">
            <div class="health-title">
              <i class="fas fa-chart-line health-ico"></i>
              Thông số sức khỏe
            </div>
            <span class="live-sync-badge">Live Sync</span>
          </div>

          <div class="health-field">
            <label class="health-label">CÂN NẶNG (KG)</label>
            <input
              v-model.number="form.weight"
              type="number"
              class="health-input"
              placeholder="70"
              @input="calcBmi"
            />
          </div>

          <div class="health-field">
            <label class="health-label">CHIỀU CAO (CM)</label>
            <input
              v-model.number="form.height"
              type="number"
              class="health-input"
              placeholder="175"
              @input="calcBmi"
            />
          </div>

          <!-- BMI dự đoán -->
          <div class="bmi-row">
            <div class="bmi-icon"><i class="fas fa-bolt"></i></div>
            <div class="bmi-content">
              <div class="bmi-label">DỰ ĐOÁN BMI</div>
              <div class="bmi-value" v-if="bmi">{{ bmi }} — {{ bmiLabel }}</div>
              <div class="bmi-value calculating" v-else>Đang tính toán...</div>
            </div>
          </div>
        </div>

        <!-- Card 2: Lựa chọn dịch vụ (white) -->
        <div class="service-card">
          <div class="service-title">
            <i class="fas fa-exchange-alt service-ico"></i>
            Lựa chọn dịch vụ
          </div>

          <div class="svc-field">
            <label class="svc-label">GÓI DỊCH VỤ</label>
            <div class="svc-select-wrap">
              <select v-model="form.package" class="svc-select" @change="updateFee">
                <option value="platinum12">Gói Platinum (12 tháng)</option>
                <option value="gold6">Gói Gold (6 tháng)</option>
                <option value="silver3">Gói Silver (3 tháng)</option>
                <option value="basic1">Gói Basic (1 tháng)</option>
              </select>
            </div>
          </div>

          <div class="svc-field">
            <label class="svc-label">NGÀY BẮT ĐẦU</label>
            <input v-model="form.startDate" type="date" class="svc-date" />
          </div>

          <div class="fee-rows">
            <div class="fee-row">
              <span class="fee-key">Phí đăng ký</span>
              <span class="fee-val">{{ formatCurrency(fee) }}</span>
            </div>
            <div class="fee-row fee-total">
              <span class="fee-key">Tổng cộng</span>
              <span class="fee-val">{{ formatCurrency(fee) }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { memberApi } from '@/services/memberApi'

export default {
  name: 'HoiVienMoi',
  data() {
    return {
      // ── BMI ──
      bmi: null,
      bmiLabel: '',

      // ── Form data ──
      form: {
        // Thông tin cá nhân
        full_name:   '',
        phone:       '',
        email:       '',
        password:    '',          // auto-generate nếu không nhập
        gender:      '',
        date_of_birth: '',
        // Sức khoẻ
        weight:      70,
        height:      175,
        health_notes: '',         // tiền sử y tế
        // Gói dịch vụ
        plan_id:     null,
        promotion_id: null,
        start_date:  new Date().toISOString().slice(0, 10),
        payment_method: 'cash',
      },

      // ── Danh sách gói / khuyến mãi từ API ──
      plans:      [],
      promotions: [],

      // ── UI state ──
      loading:      false,
      submitting:   false,
      error:        null,
      successMsg:   null,
    }
  },

  computed: {
    selectedPlan() {
      return this.plans.find(p => p.id === this.form.plan_id) || null
    },
    /** Giá sau khi áp khuyến mãi */
    finalPrice() {
      if (!this.selectedPlan) return 0
      const base = parseFloat(this.selectedPlan.price) || 0
      const promo = this.promotions.find(p => p.id === this.form.promotion_id)
      if (promo && promo.discount > 0) {
        return base * (1 - promo.discount / 100)
      }
      return base
    },
    /** Ngày kết thúc tự tính dựa trên duration_days */
    endDate() {
      if (!this.selectedPlan || !this.form.start_date) return ''
      const start = new Date(this.form.start_date)
      start.setDate(start.getDate() + (this.selectedPlan.duration_days || 0))
      return start.toISOString().slice(0, 10)
    },
  },

  async mounted() {
    this.calcBmi()
    await this.loadFormData()
  },

  methods: {
    // ── Load dữ liệu cho dropdown ──
    async loadFormData() {
      this.loading = true
      try {
        const [plansRes, promoRes] = await Promise.all([
          memberApi.getActivePlans(),
          memberApi.getActivePromotions(),
        ])
        this.plans      = plansRes.data  || []
        this.promotions = promoRes.data  || []
        // Chọn gói đầu tiên mặc định
        if (this.plans.length > 0) {
          this.form.plan_id = this.plans[0].id
        }
      } catch (err) {
        console.error('[HoiVienMoi] loadFormData:', err)
        this.error = 'Không thể tải dữ liệu gói tập. Vui lòng thử lại.'
      } finally {
        this.loading = false
      }
    },

    // ── Tính BMI ──
    calcBmi() {
      const w = parseFloat(this.form.weight)
      const h = parseFloat(this.form.height)
      if (w > 0 && h > 0) {
        const bmiVal = w / Math.pow(h / 100, 2)
        this.bmi = bmiVal.toFixed(1)
        if (bmiVal < 18.5)      this.bmiLabel = 'Thiếu cân'
        else if (bmiVal < 25)   this.bmiLabel = 'Bình thường'
        else if (bmiVal < 30)   this.bmiLabel = 'Thừa cân'
        else                    this.bmiLabel = 'Béo phì'
      } else {
        this.bmi = null
        this.bmiLabel = ''
      }
    },

    formatCurrency(val) {
      return Number(val).toLocaleString('vi-VN') + 'đ'
    },

    cancel() {
      this.$router.push('/nhanvien')
    },

    // ── Validate form ──
    validate() {
      if (!this.form.full_name.trim())  return 'Vui lòng nhập họ tên.'
      if (!this.form.phone.trim())      return 'Vui lòng nhập số điện thoại.'
      if (!this.form.email.trim())      return 'Vui lòng nhập địa chỉ email.'
      if (!/\S+@\S+\.\S+/.test(this.form.email)) return 'Email không hợp lệ.'
      return null
    },

    // ── Submit: gọi POST /api/members ──
    async submit() {
      this.error = null
      this.successMsg = null

      const errMsg = this.validate()
      if (errMsg) { this.error = errMsg; return }

      this.submitting = true
      try {
        // Build payload theo MemberController@store
        const payload = {
          // User fields (name = email prefix nếu không có)
          name:       this.form.email.split('@')[0],
          email:      this.form.email,
          password:   this.form.password || Math.random().toString(36).slice(-8),
          full_name:  this.form.full_name,
          phone:      this.form.phone,
          gender:     this.form.gender   || undefined,
          // Member profile
          date_of_birth: this.form.date_of_birth || undefined,
          health_notes:  this.form.health_notes  || undefined,
          join_date:     this.form.start_date,
          // Gói tập (nếu có chọn)
          ...(this.form.plan_id ? {
            plan_id:      this.form.plan_id,
            promotion_id: this.form.promotion_id || undefined,
            start_date:   this.form.start_date,
            end_date:     this.endDate,
            price:        this.finalPrice,
          } : {}),
        }

        await memberApi.create(payload)

        this.successMsg = `Đã tạo hội viên ${this.form.full_name} thành công!`
        setTimeout(() => this.$router.push('/nhanvien'), 1500)
      } catch (err) {
        const errors = err.response?.data?.errors
        if (errors) {
          // Laravel validation errors
          this.error = Object.values(errors).flat().join(' | ')
        } else {
          this.error = err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.'
        }
      } finally {
        this.submitting = false
      }
    },
  },
}
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* { box-sizing: border-box; }

.reg-page {
  padding: 24px 28px;
  min-height: 100%;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  background: #f2f6f3;
}

/* ===== TITLE ROW ===== */
.reg-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 22px;
  flex-wrap: wrap;
  gap: 12px;
}
.reg-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1a2e22;
  margin: 0 0 6px;
  letter-spacing: -0.5px;
}
.reg-sub {
  font-size: 0.8rem;
  color: #78909c;
  margin: 0;
}

/* AI badge button */
.btn-ai-badge {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  background: #0d9488;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.78rem;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(13,148,136,0.3);
  transition: all 0.2s;
  letter-spacing: 0.01em;
}
.btn-ai-badge:hover {
  background: #0f766e;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(13,148,136,0.4);
}
.ai-star {
  font-size: 0.9rem;
  color: #99f6e4;
}

/* ===== BODY LAYOUT ===== */
.reg-body {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

/* ========== LEFT ========== */
.reg-left {
  flex: 1;
  min-width: 0;
}

.section-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e6ede9;
  box-shadow: 0 2px 10px rgba(0,0,0,0.055);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.92rem;
  font-weight: 700;
  color: #1a2e22;
  margin-bottom: 20px;
}
.section-ico {
  color: #2d7a3a;
  font-size: 0.95rem;
}

/* Form rows */
.form-row {
  margin-bottom: 16px;
}
.form-row.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.form-group { display: flex; flex-direction: column; }
.form-group.full { width: 100%; }

.form-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.req { color: #ef4444; }

.form-input {
  padding: 10px 13px;
  background: #f4f7f5;
  border: 1px solid #dde5df;
  border-radius: 9px;
  font-size: 0.84rem;
  color: #334155;
  font-family: 'Inter', sans-serif;
  outline: none;
  transition: all 0.18s;
  width: 100%;
}
.form-input::placeholder { color: #adb5bd; }
.form-input:focus {
  border-color: #2d7a3a;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(45,122,58,0.08);
}

.form-textarea {
  padding: 10px 13px;
  background: #f4f7f5;
  border: 1px solid #dde5df;
  border-radius: 9px;
  font-size: 0.82rem;
  color: #334155;
  font-family: 'Inter', sans-serif;
  outline: none;
  transition: all 0.18s;
  resize: none;
  height: 90px;
  width: 100%;
  line-height: 1.5;
}
.form-textarea::placeholder { color: #adb5bd; }
.form-textarea:focus {
  border-color: #2d7a3a;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(45,122,58,0.08);
}

/* Actions */
.form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid #f0f4f0;
}
.btn-cancel {
  background: none;
  border: none;
  font-size: 0.84rem;
  font-weight: 600;
  color: #78909c;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  padding: 6px 0;
  text-decoration: none;
  transition: color 0.18s;
}
.btn-cancel:hover { color: #475569; }

.btn-submit {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 22px;
  background: linear-gradient(135deg, #2d7a3a, #1c5e2e);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.86rem;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(45,122,58,0.3);
  transition: all 0.2s;
  letter-spacing: 0.01em;
}
.btn-submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 7px 20px rgba(45,122,58,0.4);
}
.btn-submit i { font-size: 0.9rem; }

/* ========== RIGHT ========== */
.reg-right {
  width: 260px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ---- Health Card (dark green) ---- */
.health-card {
  background: linear-gradient(145deg, #1b3a22, #0e2817);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 18px rgba(14,40,23,0.32);
}

.health-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.health-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.88rem;
  font-weight: 700;
  color: #fff;
}
.health-ico {
  color: #4ade80;
  font-size: 0.85rem;
}
.live-sync-badge {
  font-size: 0.62rem;
  font-weight: 700;
  color: #4ade80;
  background: rgba(74,222,128,0.15);
  border: 1px solid rgba(74,222,128,0.3);
  border-radius: 20px;
  padding: 2px 9px;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.health-field { margin-bottom: 14px; }
.health-label {
  display: block;
  font-size: 0.62rem;
  font-weight: 700;
  color: rgba(255,255,255,0.5);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.health-input {
  width: 100%;
  padding: 9px 13px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 9px;
  font-size: 0.88rem;
  font-weight: 600;
  color: #fff;
  font-family: 'Inter', sans-serif;
  outline: none;
  transition: all 0.18s;
}
.health-input::placeholder { color: rgba(255,255,255,0.3); }
.health-input:focus {
  border-color: rgba(74,222,128,0.5);
  background: rgba(255,255,255,0.12);
}

/* BMI row */
.bmi-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 13px;
  background: rgba(255,255,255,0.07);
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1);
  margin-top: 4px;
}
.bmi-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(74,222,128,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4ade80;
  font-size: 0.78rem;
  flex-shrink: 0;
}
.bmi-content { flex: 1; }
.bmi-label {
  font-size: 0.58rem;
  font-weight: 700;
  color: rgba(255,255,255,0.4);
  letter-spacing: 0.07em;
  text-transform: uppercase;
  margin-bottom: 2px;
}
.bmi-value {
  font-size: 0.82rem;
  font-weight: 600;
  color: #4ade80;
}
.bmi-value.calculating { color: rgba(255,255,255,0.45); font-style: italic; }

/* ---- Service Card (white) ---- */
.service-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #e6ede9;
  box-shadow: 0 2px 10px rgba(0,0,0,0.055);
}

.service-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.88rem;
  font-weight: 700;
  color: #1a2e22;
  margin-bottom: 16px;
}
.service-ico {
  color: #2d7a3a;
  font-size: 0.82rem;
}

.svc-field { margin-bottom: 14px; }
.svc-label {
  display: block;
  font-size: 0.62rem;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.svc-select-wrap { position: relative; }
.svc-select {
  width: 100%;
  padding: 9px 32px 9px 12px;
  background: #f4f7f5;
  border: 1px solid #dde5df;
  border-radius: 9px;
  font-size: 0.82rem;
  color: #334155;
  font-family: 'Inter', sans-serif;
  outline: none;
  cursor: pointer;
  appearance: none;
  transition: all 0.18s;
}
.svc-select:focus {
  border-color: #2d7a3a;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(45,122,58,0.08);
}
.svc-select-wrap::after {
  content: '▾';
  position: absolute;
  right: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.78rem;
  pointer-events: none;
}

.svc-date {
  width: 100%;
  padding: 9px 12px;
  background: #f4f7f5;
  border: 1px solid #dde5df;
  border-radius: 9px;
  font-size: 0.82rem;
  color: #334155;
  font-family: 'Inter', sans-serif;
  outline: none;
  transition: all 0.18s;
}
.svc-date:focus {
  border-color: #2d7a3a;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(45,122,58,0.08);
}

/* Fee */
.fee-rows {
  border-top: 1px solid #f0f4f0;
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.fee-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.fee-key {
  font-size: 0.78rem;
  color: #64748b;
}
.fee-val {
  font-size: 0.82rem;
  color: #334155;
  font-weight: 500;
}
.fee-total .fee-key {
  font-size: 0.84rem;
  font-weight: 700;
  color: #1a2e22;
}
.fee-total .fee-val {
  font-size: 0.9rem;
  font-weight: 800;
  color: #1a2e22;
}

/* Responsive */
@media (max-width: 900px) {
  .reg-body { flex-direction: column; }
  .reg-right { width: 100%; }
}
@media (max-width: 600px) {
  .form-row.two-col { grid-template-columns: 1fr; }
}
</style>
