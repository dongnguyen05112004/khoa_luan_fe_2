<template>
  <div class="xltoan-page">

    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <router-link to="/nhanvien/thu_tien" class="bread-link">
        <i class="fas fa-arrow-left"></i> Giao dịch
      </router-link>
      <span class="bread-sep"><i class="fas fa-chevron-right"></i></span>
      <span class="bread-current">Thanh toán &amp; Xuất hóa đơn</span>
    </div>

    <!-- Page Title -->
    <h1 class="page-title">Thanh toán &amp; Xuất hóa đơn</h1>

    <!-- Loading toàn trang -->
    <div v-if="pageLoading" class="page-loading">
      <div class="loading-spinner"></div>
      <span>Đang tải thông tin giao dịch...</span>
    </div>

    <!-- Two-column layout -->
    <div class="xl-layout" v-else>

      <!-- ===== LEFT PANEL ===== -->
      <div class="xl-left">

        <!-- Tìm kiếm hội viên -->
        <div class="panel-card">
          <div class="panel-title">
            <i class="fas fa-user-search panel-ico"></i> Hội viên & Dịch vụ
          </div>

          <div class="field-group">
            <div class="field-label">Tìm kiếm hội viên</div>
            <div class="member-search-wrap">
              <i class="fas fa-search ms-ico"></i>
              <input
                v-model="memberSearch"
                type="text"
                placeholder="Nhập tên, email hoặc SĐT..."
                class="member-search-input"
                @input="onMemberSearch"
                @focus="showSuggestions = true"
              />
              <div class="ms-suggestions" v-if="showSuggestions && memberSuggestions.length">
                <div
                  class="ms-item"
                  v-for="m in memberSuggestions"
                  :key="m.id"
                  @click="selectMember(m)"
                >
                  <img
                    :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(m.full_name || m.name)}&background=1a4d24&color=fff&bold=true&size=40`"
                    class="ms-avatar"
                  />
                  <div>
                    <div class="ms-name">{{ m.full_name || m.name }}</div>
                    <div class="ms-sub">{{ m.email }} · {{ m.phone || '—' }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="selected-member" v-if="selectedMember">
              <img
                :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMember.full_name || selectedMember.name)}&background=1a4d24&color=fff&bold=true&size=60`"
                class="sm-avatar"
              />
              <div class="sm-info">
                <div class="sm-name">{{ selectedMember.full_name || selectedMember.name }}</div>
                <div class="sm-email">{{ selectedMember.email }}</div>
              </div>
              <button class="sm-remove" @click="removeMember"><i class="fas fa-times"></i></button>
            </div>
          </div>

          <!-- Chọn gói tập -->
          <div class="field-group">
            <div class="field-label">Gói tập</div>
            <select v-model="selectedPlanId" class="plan-select" @change="onPlanChange">
              <option value="">-- Chọn gói tập --</option>
              <option v-for="p in plans" :key="p.id" :value="p.id">
                {{ p.plan_name }} – {{ formatVND(p.price) }}đ ({{ p.duration_days }} ngày)
              </option>
            </select>
          </div>
        </div>

        <!-- Chi tiết thanh toán -->
        <div class="panel-card">
          <div class="panel-title">
            <i class="fas fa-receipt panel-ico"></i> Chi tiết thanh toán
          </div>

          <!-- Phương thức thanh toán -->
          <div class="field-group">
            <div class="field-label">Phương thức thanh toán</div>
            <div class="payment-methods">
              <button
                v-for="m in paymentMethodOptions"
                :key="m.key"
                class="pm-btn"
                :class="{ active: selectedMethod === m.key }"
                @click="selectedMethod = m.key"
              >
                <i :class="m.icon" class="pm-icon"></i>
                <span class="pm-label">{{ m.label }}</span>
              </button>
            </div>
          </div>

          <!-- Mã khuyến mãi -->
          <div class="field-group">
            <div class="field-label">Mã khuyến mãi</div>
            <div class="promo-row">
              <input
                v-model="promoCode"
                type="text"
                placeholder="Nhập mã ưu đãi..."
                class="promo-input"
                @keyup.enter="applyPromo"
              />
              <button class="btn-apply" @click="applyPromo" :disabled="promoLoading">
                <span v-if="promoLoading"><i class="fas fa-spinner fa-spin"></i></span>
                <span v-else>Áp dụng</span>
              </button>
            </div>
            <div v-if="promoMsg" class="promo-msg" :class="promoMsgClass">
              {{ promoMsg }}
            </div>
          </div>

          <!-- ===== CHUYỂN KHOẢN – Techcombank QR ===== -->
          <transition name="slide-down">
            <div v-if="selectedMethod === 'bank_transfer'" class="bank-transfer-section">
              <div class="bank-header">
                <div class="bank-header-text">
                  <div class="bank-section-title">Thông tin chuyển khoản</div>
                  <div class="bank-section-sub">
                    Vui lòng quét mã QR hoặc nhập thông tin bên dưới để hoàn tất giao dịch.
                  </div>
                </div>
                <div class="qr-wrap">
                  <img
                    :src="qrUrl"
                    class="qr-img"
                    alt="QR Code Techcombank"
                    @error="onQrError"
                  />
                  <div class="qr-label">Scan QR</div>
                  <div class="qr-bank-badge">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Techcombank.svg/200px-Techcombank.svg.png"
                         class="qr-bank-logo" alt="Techcombank" />
                  </div>
                </div>
              </div>

              <div class="bank-info-grid">
                <div class="bank-info-item">
                  <div class="bi-label">NGÂN HÀNG</div>
                  <div class="bi-val">Techcombank (TCB)</div>
                </div>
                <div class="bank-info-item">
                  <div class="bi-label">SỐ TIỀN THANH TOÁN</div>
                  <div class="bi-val bi-amount">{{ formatVND(total) }} đ</div>
                </div>
                <div class="bank-info-item">
                  <div class="bi-label">CHỦ TÀI KHOẢN</div>
                  <div class="bi-val">KP FITNESS GYM</div>
                </div>
                <div class="bank-info-item">
                  <div class="bi-label">ĐỊA ĐIỂM</div>
                  <div class="bi-val">Hồ Chí Minh – Quận 1</div>
                </div>
                <div class="bank-info-item bank-info-full">
                  <div class="bi-label">SỐ TÀI KHOẢN</div>
                  <div class="bi-val bi-copy-row">
                    <span class="bi-account-num">1903 9637 3280 12</span>
                    <button class="btn-copy" :class="{ copied: copiedKey === 'account' }" @click="copyText('19039637328012', 'account')">
                      <i :class="copiedKey === 'account' ? 'fas fa-check' : 'fas fa-copy'"></i>
                    </button>
                  </div>
                </div>
                <div class="bank-info-item bank-info-full">
                  <div class="bi-label">NỘI DUNG CHUYỂN KHOẢN</div>
                  <div class="bi-val bi-copy-row">
                    <span class="bi-content">{{ transferContent }}</span>
                    <button class="btn-copy" :class="{ copied: copiedKey === 'content' }" @click="copyText(transferContent, 'content')">
                      <i :class="copiedKey === 'content' ? 'fas fa-check' : 'fas fa-copy'"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="bank-note">
                <i class="fas fa-info-circle"></i>
                Lưu ý: Sau khi chuyển khoản, giao dịch sẽ được xác nhận trong 3–5 phút.
              </div>

              <button class="btn-bank-confirm" @click="confirmPayment" :disabled="actionLoading">
                <span v-if="actionLoading"><i class="fas fa-spinner fa-spin"></i> Đang xử lý...</span>
                <span v-else><i class="fas fa-check-circle"></i> Xác nhận đã thanh toán</span>
              </button>
            </div>
          </transition>

          <!-- ===== THẺ TÍN DỤNG ===== -->
          <transition name="slide-down">
            <div v-if="selectedMethod === 'card'" class="card-section">
              <div class="card-badge">THẺ TÍN DỤNG / THẺ GHI NỢ</div>

              <div class="card-field-group">
                <div class="card-field-label">TÊN CHỦ THẺ</div>
                <input v-model="cardName" type="text" placeholder="NGUYEN VAN A" class="card-input" style="text-transform: uppercase" />
              </div>

              <div class="card-field-group">
                <div class="card-field-label">SỐ THẺ</div>
                <div class="card-input-wrap">
                  <i class="fas fa-credit-card card-input-ico"></i>
                  <input v-model="cardNumber" type="text" placeholder="0000 0000 0000 0000" maxlength="19" class="card-input card-input-icon" @input="formatCardNumber" />
                </div>
              </div>

              <div class="card-row-2">
                <div class="card-field-group">
                  <div class="card-field-label">NGÀY HẾT HẠN (MM/YY)</div>
                  <input v-model="cardExpiry" type="text" placeholder="MM/YY" maxlength="5" class="card-input" @input="formatExpiry" />
                </div>
                <div class="card-field-group">
                  <div class="card-field-label">CVV</div>
                  <input v-model="cardCvv" type="password" placeholder="***" maxlength="4" class="card-input" />
                </div>
              </div>

              <button class="btn-bank-confirm" @click="confirmPayment" :disabled="actionLoading">
                <span v-if="actionLoading"><i class="fas fa-spinner fa-spin"></i> Đang xử lý...</span>
                <span v-else><i class="fas fa-check-circle"></i> Thanh toán thẻ</span>
              </button>
            </div>
          </transition>

          <!-- ===== TIỀN MẶT ===== -->
          <transition name="slide-down">
            <div v-if="selectedMethod === 'cash'" class="cash-section">
              <div class="cash-info">
                <i class="fas fa-money-bill-wave cash-ico"></i>
                <div>
                  <div class="cash-title">Thanh toán tiền mặt</div>
                  <div class="cash-sub">Nhân viên thu {{ formatVND(total) }}đ từ hội viên và xác nhận bên dưới.</div>
                </div>
              </div>
              <button class="btn-bank-confirm" @click="confirmPayment" :disabled="actionLoading">
                <span v-if="actionLoading"><i class="fas fa-spinner fa-spin"></i> Đang xử lý...</span>
                <span v-else><i class="fas fa-check-circle"></i> Xác nhận đã thu tiền</span>
              </button>
            </div>
          </transition>
        </div>

        <!-- Ghi chú -->
        <div class="panel-card">
          <div class="panel-title">
            <i class="fas fa-sticky-note panel-ico"></i> Ghi chú giao dịch
          </div>
          <textarea v-model="note" class="note-textarea" placeholder="Nhập ghi chú hoặc yêu cầu xuất hóa đơn..." rows="3"></textarea>
        </div>

      </div>

      <!-- ===== RIGHT PANEL ===== -->
      <div class="xl-right">
        <div class="summary-card">

          <div class="summary-title">Thông tin giao dịch</div>

          <div class="summary-rows">
            <div class="sum-row">
              <span class="sum-label">Mã hội viên</span>
              <span class="sum-val sum-code">{{ selectedMember ? '#MB-' + String(selectedMember.id).padStart(4,'0') : '—' }}</span>
            </div>
            <div class="sum-row sum-service">
              <span class="sum-label">Dịch vụ</span>
              <div class="sum-service-detail">
                <div class="sum-service-name">{{ selectedPlanObj?.plan_name || serviceName }}</div>
                <div class="sum-service-sub">{{ selectedMember?.full_name || selectedMember?.name || serviceSub }}</div>
              </div>
            </div>
            <div class="sum-row" v-if="promoApplied">
              <span class="sum-label">Mã KM</span>
              <span class="sum-val promo-tag">{{ promoCode.toUpperCase() }}</span>
            </div>
          </div>

          <div class="sum-divider"></div>

          <div class="sum-calc-rows">
            <div class="calc-row">
              <span class="calc-label">Tạm tính</span>
              <span class="calc-val">{{ formatVND(subtotal) }}&nbsp;đ</span>
            </div>
            <div class="calc-row discount" v-if="discount > 0">
              <span class="calc-label">Giảm giá ({{ discountPct }}%)</span>
              <span class="calc-val">-{{ formatVND(discount) }}&nbsp;đ</span>
            </div>
          </div>

          <div class="sum-total-row">
            <span class="total-label">Tổng<br/>cộng</span>
            <span class="total-val">{{ formatVND(total) }}<br/><span class="total-unit">đ</span></span>
          </div>

          <button class="btn-confirm" @click="confirmPayment" :disabled="actionLoading">
            <span v-if="actionLoading"><i class="fas fa-spinner fa-spin"></i> Đang xử lý...</span>
            <span v-else><i class="fas fa-check-circle"></i> Xác nhận thanh toán</span>
          </button>
          <button class="btn-print" @click="printInvoice">
            <i class="fas fa-print"></i> In hóa đơn (PDF)
          </button>

          <p class="summary-note">
            Giao dịch sẽ được ghi lại và lịch sử thanh toán được cập nhật.
          </p>

        </div>

        <!-- Error message -->
        <div class="error-card" v-if="errorMsg">
          <i class="fas fa-exclamation-triangle"></i> {{ errorMsg }}
        </div>

      </div>

    </div>

    <!-- Success overlay -->
    <div class="success-overlay" v-if="showSuccess" @click.self="showSuccess = false">
      <div class="success-modal">
        <div class="success-icon"><i class="fas fa-check-circle"></i></div>
        <div class="success-title">Thanh toán thành công!</div>
        <div class="success-sub">
          Giao dịch <strong>{{ createdInvoiceNumber }}</strong> đã được xác nhận.
        </div>
        <div class="success-amount">{{ formatVND(total) }} đ</div>
        <div class="success-actions">
          <button class="btn-print-inv" @click="printInvoice">
            <i class="fas fa-print"></i> In hóa đơn
          </button>
          <button class="btn-back-list" @click="$router.push('/nhanvien/thu_tien')">
            Quay về danh sách
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { paymentApi, getTechcombankQR, generateTransferContent, formatVND } from '@/services/paymentApi.js'

export default {
  name: 'XuLyThanhToan',

  data() {
    return {
      // Page loading
      pageLoading: false,
      actionLoading: false,
      promoLoading: false,
      errorMsg: '',

      // Member search
      memberSearch: '',
      memberSuggestions: [],
      showSuggestions: false,
      selectedMember: null,
      searchTimer: null,

      // Plans
      plans: [],
      selectedPlanId: '',

      // Payment
      selectedMethod: 'cash',
      promoCode: '',
      promoMsg: '',
      promoMsgClass: '',
      promoApplied: false,
      promoId: null,
      discountPct: 0,

      // Card fields
      cardName: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',

      // Values
      subtotal: 0,
      discount: 0,

      // Copy state
      copiedKey: '',

      // Note
      note: '',

      // From route query (nếu chuyển từ thu_tien)
      contractId: '',
      serviceName: 'Chưa chọn dịch vụ',
      serviceSub: 'Chưa chọn hội viên',

      // Success
      showSuccess: false,
      createdInvoiceNumber: '',

      paymentMethodOptions: [
        { key: 'cash',          label: 'Tiền mặt',    icon: 'fas fa-money-bill-wave' },
        { key: 'bank_transfer', label: 'Chuyển khoản', icon: 'fas fa-university' },
        { key: 'card',          label: 'Thẻ tín dụng', icon: 'fas fa-credit-card' },
      ],
    }
  },

  computed: {
    total() {
      return Math.max(0, this.subtotal - this.discount)
    },

    selectedPlanObj() {
      return this.plans.find(p => p.id == this.selectedPlanId) || null
    },

    // QR Techcombank cho số tiền hiện tại
    qrUrl() {
      return getTechcombankQR(this.total, this.transferContent, 150)
    },

    // Nội dung chuyển khoản
    transferContent() {
      if (this.contractId) return generateTransferContent(this.contractId)
      const memberId = this.selectedMember?.id ?? ''
      return 'KPFIT' + (memberId ? String(memberId).padStart(4, '0') : '') + Date.now().toString().slice(-4)
    },
  },

  async mounted() {
    // Đọc query params truyền từ thu_tien
    const q = this.$route.query
    if (q.txId)    this.contractId  = q.txId
    if (q.amount)  this.subtotal    = Number(q.amount)
    if (q.member)  this.serviceSub  = q.member
    if (q.service) this.serviceName = q.service

    // Load danh sách gói tập
    await this.loadPlans()

    // Đóng suggestions khi click ra ngoài
    document.addEventListener('click', this.closeOnOutside)
  },

  beforeUnmount() {
    document.removeEventListener('click', this.closeOnOutside)
  },

  methods: {
    // ── Utilities ──────────────────────────────────────────────
    formatVND(amount) {
      return Number(amount || 0).toLocaleString('vi-VN')
    },

    closeOnOutside(e) {
      if (!e.target.closest('.member-search-wrap')) {
        this.showSuggestions = false
      }
    },

    // ── Load data ───────────────────────────────────────────────
    async loadPlans() {
      try {
        const { data } = await paymentApi.getActivePlans()
        this.plans = data
      } catch (err) {
        console.error('Load plans error:', err)
      }
    },

    // ── Member search ───────────────────────────────────────────
    onMemberSearch() {
      clearTimeout(this.searchTimer)
      const q = this.memberSearch.trim()
      if (!q) { this.memberSuggestions = []; return }
      this.searchTimer = setTimeout(async () => {
        try {
          const { data } = await paymentApi.searchMembers(q, 8)
          this.memberSuggestions = data
          this.showSuggestions   = true
        } catch (err) {
          this.memberSuggestions = []
        }
      }, 300)
    },

    selectMember(m) {
      this.selectedMember    = m
      this.memberSearch      = ''
      this.memberSuggestions = []
      this.showSuggestions   = false
    },

    removeMember() {
      this.selectedMember = null
      this.memberSearch   = ''
    },

    // ── Plan change ─────────────────────────────────────────────
    onPlanChange() {
      const plan = this.selectedPlanObj
      if (plan) {
        this.subtotal    = plan.price
        this.discount    = 0
        this.promoMsg    = ''
        this.promoApplied = false
        this.promoId     = null
      }
    },

    // ── Validate promo ──────────────────────────────────────────
    async applyPromo() {
      if (!this.promoCode.trim()) {
        this.promoMsg      = 'Vui lòng nhập mã khuyến mãi.'
        this.promoMsgClass = 'promo-err'
        return
      }
      this.promoLoading = true
      this.promoMsg     = ''
      try {
        const { data } = await paymentApi.validatePromo(this.promoCode, this.subtotal)
        if (data.valid) {
          this.promoMsg      = data.message
          this.promoMsgClass = 'promo-ok'
          this.discount      = data.discount_amount
          this.discountPct   = data.discount
          this.promoId       = data.promo_id
          this.promoApplied  = true
        } else {
          this.promoMsg      = data.message
          this.promoMsgClass = 'promo-err'
          this.discount      = 0
          this.promoApplied  = false
          this.promoId       = null
        }
      } catch (err) {
        this.promoMsg      = '✗ Lỗi kiểm tra mã khuyến mãi.'
        this.promoMsgClass = 'promo-err'
      } finally {
        this.promoLoading = false
      }
    },

    // ── Confirm payment ─────────────────────────────────────────
    async confirmPayment() {
      // Validation
      if (!this.selectedMember && !this.contractId) {
        this.errorMsg = 'Vui lòng chọn hội viên!'
        setTimeout(() => { this.errorMsg = '' }, 4000)
        return
      }
      if (this.subtotal <= 0 && !this.selectedPlanId) {
        this.errorMsg = 'Vui lòng chọn gói tập hoặc nhập số tiền!'
        setTimeout(() => { this.errorMsg = '' }, 4000)
        return
      }

      this.actionLoading = true
      this.errorMsg = ''

      try {
        const payload = {
          user_id:        this.selectedMember?.id ?? null,
          subscription_id: null, // có thể truyền nếu có contractId
          amount:          this.total,
          payment_method:  this.selectedMethod,
          status:          'paid',
          payment_confirmed: true,
          note:            this.note || null,
        }

        if (this.promoId) payload.promotion_id = this.promoId

        const { data } = await paymentApi.create(payload)
        this.createdInvoiceNumber = data.invoice_number ?? data.txId ?? '#—'
        this.showSuccess = true
      } catch (err) {
        const msg = err.response?.data?.message || 'Lỗi xử lý thanh toán. Vui lòng thử lại.'
        this.errorMsg = msg
        setTimeout(() => { this.errorMsg = '' }, 5000)
      } finally {
        this.actionLoading = false
      }
    },

    printInvoice() {
      window.print()
    },

    copyText(text, key) {
      navigator.clipboard.writeText(text).catch(() => {
        const el = document.createElement('textarea')
        el.value = text
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
      })
      this.copiedKey = key
      setTimeout(() => { this.copiedKey = '' }, 2000)
    },

    formatCardNumber() {
      let val = this.cardNumber.replace(/\D/g, '').substring(0, 16)
      this.cardNumber = val.replace(/(\d{4})(?=\d)/g, '$1 ')
    },

    formatExpiry() {
      let val = this.cardExpiry.replace(/\D/g, '').substring(0, 4)
      if (val.length >= 3) val = val.substring(0, 2) + '/' + val.substring(2)
      this.cardExpiry = val
    },

    onQrError(e) {
      // Fallback nếu VietQR không load được
      e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TECHCOMBANK-19039637328012-${this.transferContent}`
    },
  },
}
</script>

<style scoped>

/* ===== BASE ===== */
.xltoan-page {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  padding: 24px 28px 40px;
}

/* ===== BREADCRUMB ===== */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 0.8rem;
  color: #94a3b8;
}
.bread-link {
  color: #2d7a3a;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.15s;
}
.bread-link:hover { color: #133a1b; }
.bread-sep { color: #cbd5e1; font-size: 0.65rem; }
.bread-current { color: #64748b; }

/* ===== PAGE TITLE ===== */
.page-title {
  font-size: 1.55rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 22px;
  letter-spacing: -0.3px;
}

/* ===== PAGE LOADING ===== */
.page-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 80px;
  color: #64748b;
  font-size: 0.9rem;
}
.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #e2e8f0;
  border-top-color: #2d7a3a;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ===== LAYOUT ===== */
.xl-layout {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}
.xl-left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.xl-right {
  width: 270px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* ===== PANEL CARD ===== */
.panel-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px 22px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
}
.panel-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}
.panel-ico { color: #2d7a3a; }

/* Field group */
.field-group { margin-bottom: 20px; }
.field-group:last-child { margin-bottom: 0; }
.field-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 10px;
  display: block;
}

/* ===== MEMBER SEARCH ===== */
.member-search-wrap { position: relative; }
.ms-ico {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.78rem;
  pointer-events: none;
}
.member-search-input {
  width: 100%;
  padding: 9px 12px 9px 32px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.84rem;
  color: #334155;
  font-family: inherit;
  outline: none;
  background: #f8fafc;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.member-search-input:focus { border-color: #2d7a3a; background: #fff; }
.ms-suggestions {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 4px);
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
  z-index: 50;
  overflow: hidden;
}
.ms-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.15s;
}
.ms-item:hover { background: #f0fdf4; }
.ms-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
}
.ms-name { font-size: 0.84rem; font-weight: 600; color: #0f172a; }
.ms-sub  { font-size: 0.72rem; color: #64748b; margin-top: 1px; }

.selected-member {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f0fdf4;
  border: 1.5px solid #bbf7d0;
  border-radius: 10px;
  padding: 10px 12px;
  margin-top: 10px;
}
.sm-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  flex-shrink: 0;
}
.sm-info { flex: 1; }
.sm-name  { font-size: 0.86rem; font-weight: 700; color: #0f172a; }
.sm-email { font-size: 0.74rem; color: #64748b; }
.sm-remove {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 0.9rem;
  transition: color 0.15s;
}
.sm-remove:hover { color: #dc2626; }

/* ===== PLAN SELECT ===== */
.plan-select {
  width: 100%;
  padding: 9px 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.84rem;
  color: #334155;
  font-family: inherit;
  outline: none;
  background: #f8fafc;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.plan-select:focus { border-color: #2d7a3a; background: #fff; }

/* ===== PAYMENT METHOD BUTTONS ===== */
.payment-methods {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.pm-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: #fff;
  color: #64748b;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 90px;
}
.pm-btn:hover { border-color: #2d7a3a; color: #2d7a3a; background: #f0fdf4; }
.pm-btn.active {
  border-color: #2d7a3a;
  background: #f0fdf4;
  color: #2d7a3a;
  box-shadow: 0 0 0 3px rgba(45, 122, 58, 0.12);
}
.pm-icon  { font-size: 1.1rem; }
.pm-label { font-size: 0.76rem; font-weight: 600; white-space: nowrap; }

/* ===== PROMO ===== */
.promo-row {
  display: flex;
  gap: 0;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.2s;
}
.promo-row:focus-within { border-color: #2d7a3a; }
.promo-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 9px 13px;
  font-size: 0.84rem;
  color: #334155;
  font-family: inherit;
  background: #f8fafc;
}
.promo-input::placeholder { color: #94a3b8; }
.btn-apply {
  background: #2d7a3a;
  color: #fff;
  border: none;
  padding: 9px 18px;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}
.btn-apply:hover:not(:disabled) { background: #245f2e; }
.btn-apply:disabled { opacity: 0.6; cursor: not-allowed; }
.promo-msg { font-size: 0.78rem; margin-top: 7px; }
.promo-ok  { color: #16a34a; }
.promo-err { color: #dc2626; }

/* ===== BANK TRANSFER – TECHCOMBANK ===== */
.bank-transfer-section {
  margin-top: 20px;
  border-top: 1.5px solid #e2e8f0;
  padding-top: 18px;
}
.bank-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;
}
.bank-section-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 5px;
}
.bank-section-sub {
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.5;
  max-width: 260px;
}
.qr-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.qr-img {
  width: 110px;
  height: 110px;
  border-radius: 10px;
  border: 2px solid #e2e8f0;
  padding: 4px;
  background: #fff;
  object-fit: contain;
}
.qr-label {
  font-size: 0.65rem;
  color: #94a3b8;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.qr-bank-badge {
  margin-top: 2px;
}
.qr-bank-logo {
  height: 18px;
  object-fit: contain;
}

.bank-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 14px;
}
.bank-info-full { grid-column: 1 / -1; }
.bank-info-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  padding: 10px 12px;
}
.bi-label {
  font-size: 0.6rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-bottom: 5px;
}
.bi-val {
  font-size: 0.84rem;
  font-weight: 600;
  color: #0f172a;
}
.bi-amount { color: #16a34a; font-size: 0.95rem; }
.bi-account-num {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  letter-spacing: 1px;
  color: #0f172a;
}
.bi-content {
  font-family: 'Courier New', monospace;
  font-size: 0.84rem;
  color: #1a4d24;
  font-weight: 700;
}
.bi-copy-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.btn-copy {
  width: 26px;
  height: 26px;
  border: 1.5px solid #e2e8f0;
  border-radius: 6px;
  background: #fff;
  color: #64748b;
  font-size: 0.72rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
}
.btn-copy:hover  { border-color: #2d7a3a; color: #2d7a3a; background: #f0fdf4; }
.btn-copy.copied { border-color: #16a34a; color: #16a34a; background: #dcfce7; }

.bank-note {
  font-size: 0.74rem;
  color: #64748b;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 9px 12px;
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 14px;
}
.bank-note i { color: #f59e0b; flex-shrink: 0; }

/* ===== CASH SECTION ===== */
.cash-section {
  margin-top: 20px;
  border-top: 1.5px solid #e2e8f0;
  padding-top: 18px;
}
.cash-info {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 16px;
}
.cash-ico   { font-size: 1.6rem; color: #16a34a; flex-shrink: 0; margin-top: 2px; }
.cash-title { font-size: 0.88rem; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
.cash-sub   { font-size: 0.78rem; color: #64748b; line-height: 1.5; }

/* ===== CARD SECTION ===== */
.card-section {
  margin-top: 20px;
  border-top: 1.5px solid #e2e8f0;
  padding-top: 18px;
}
.card-badge {
  display: inline-block;
  background: #0f172a;
  color: #fbbf24;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 1px;
  padding: 4px 10px;
  border-radius: 6px;
  margin-bottom: 16px;
}
.card-field-group { margin-bottom: 14px; }
.card-field-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  margin-bottom: 6px;
}
.card-input-wrap { position: relative; }
.card-input-ico {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.85rem;
  pointer-events: none;
}
.card-input {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  font-size: 0.84rem;
  color: #334155;
  font-family: 'Courier New', monospace;
  outline: none;
  background: #f8fafc;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.card-input-icon { padding-left: 34px; }
.card-input:focus { border-color: #2d7a3a; background: #fff; }
.card-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

/* ===== CONFIRM BUTTON ===== */
.btn-bank-confirm {
  width: 100%;
  padding: 12px;
  background: #2d7a3a;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
}
.btn-bank-confirm:hover:not(:disabled) { background: #245f2e; transform: translateY(-1px); }
.btn-bank-confirm:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

/* ===== NOTE TEXTAREA ===== */
.note-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  font-size: 0.83rem;
  color: #334155;
  font-family: inherit;
  resize: none;
  outline: none;
  background: #f8fafc;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.note-textarea:focus { border-color: #2d7a3a; background: #fff; }

/* ===== SUMMARY CARD ===== */
.summary-card {
  background: linear-gradient(160deg, #1a4d24 0%, #1c5e2e 70%, #0f3418 100%);
  border-radius: 16px;
  padding: 22px 20px 18px;
  color: #fff;
  box-shadow: 0 4px 24px rgba(26, 77, 36, 0.4);
}
.summary-title {
  font-size: 0.84rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 16px;
  letter-spacing: 0.3px;
}
.summary-rows { display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px; }
.sum-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}
.sum-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.55);
  flex-shrink: 0;
}
.sum-val { font-size: 0.8rem; font-weight: 600; color: rgba(255, 255, 255, 0.9); }
.sum-code { font-family: 'Courier New', monospace; font-size: 0.78rem; }
.sum-service-detail { text-align: right; }
.sum-service-name { font-size: 0.82rem; font-weight: 700; color: #fff; }
.sum-service-sub  { font-size: 0.7rem; color: rgba(255, 255, 255, 0.55); margin-top: 2px; }
.promo-tag {
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
  padding: 2px 8px;
  border-radius: 10px;
  font-family: monospace;
  font-size: 0.75rem;
  font-weight: 700;
}

.sum-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
  margin-bottom: 12px;
}
.sum-calc-rows { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.calc-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.calc-label { font-size: 0.77rem; color: rgba(255, 255, 255, 0.6); }
.calc-val   { font-size: 0.84rem; font-weight: 600; color: rgba(255, 255, 255, 0.85); }
.discount .calc-val { color: #86efac; }

/* Total */
.sum-total-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 16px;
}
.total-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
}
.total-val {
  font-size: 1.7rem;
  font-weight: 800;
  color: #fff;
  text-align: right;
  line-height: 1.15;
}
.total-unit { font-size: 1rem; font-weight: 600; }

/* Action buttons */
.btn-confirm {
  width: 100%;
  padding: 12px;
  background: #fff;
  color: #1a4d24;
  border: none;
  border-radius: 10px;
  font-size: 0.87rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 9px;
  transition: all 0.2s;
}
.btn-confirm:hover:not(:disabled) { background: #f0fdf4; transform: translateY(-1px); }
.btn-confirm:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.btn-print {
  width: 100%;
  padding: 11px;
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
  transition: all 0.2s;
}
.btn-print:hover { border-color: rgba(255, 255, 255, 0.7); color: #fff; }

.summary-note {
  font-size: 0.66rem;
  color: rgba(255, 255, 255, 0.38);
  text-align: center;
  margin: 0;
  line-height: 1.5;
}

/* Error card */
.error-card {
  background: #fee2e2;
  border: 1px solid #fca5a5;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 0.82rem;
  color: #dc2626;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ===== SUCCESS OVERLAY ===== */
.success-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.success-modal {
  background: #fff;
  border-radius: 20px;
  padding: 40px 44px;
  text-align: center;
  box-shadow: 0 16px 56px rgba(0, 0, 0, 0.22);
  animation: slideUp 0.25s ease;
  max-width: 380px;
  width: 90%;
}
@keyframes slideUp {
  from { transform: translateY(24px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
.success-icon { font-size: 3.2rem; color: #16a34a; margin-bottom: 14px; }
.success-title { font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
.success-sub   { font-size: 0.85rem; color: #64748b; margin-bottom: 8px; }
.success-amount {
  font-size: 1.6rem;
  font-weight: 800;
  color: #16a34a;
  margin-bottom: 24px;
}
.success-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}
.btn-print-inv {
  padding: 10px 18px;
  background: #f0fdf4;
  color: #2d7a3a;
  border: 1.5px solid #bbf7d0;
  border-radius: 10px;
  font-size: 0.84rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}
.btn-print-inv:hover { background: #dcfce7; }
.btn-back-list {
  padding: 10px 20px;
  background: #2d7a3a;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.87rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-back-list:hover { background: #245f2e; }

/* ===== SLIDE TRANSITION ===== */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
  max-height: 0;
}
.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 800px;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .xltoan-page { padding: 16px; }
  .xl-layout   { flex-direction: column; }
  .xl-right    { width: 100%; }
  .qr-img      { width: 90px; height: 90px; }
}

</style>
